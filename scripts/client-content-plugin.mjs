import {readFile} from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import {build} from 'esbuild';
import {loadOffers} from './load-offers.mjs';

const languages = ['ru', 'en', 'es', 'zh', 'ko'];
const roots = ['OFFERS', 'OFFER_DESCRIPTION_TRANSLATIONS', 'SEO_LANDING_PAGES', 'SERVICE_PAGE_SEO_BY_ID', 'SECTION_SEO', 'RUNTIME_SEO_TRANSLATIONS'];
const liveModules = new Set(['indexPolicy', 'servicePresentation', 'contextualGuideLinks', 'homePage']);
const metadataFields = new Set(['id', 'slug', 'name', 'title', 'description', 'heading', 'intro', 'cover', 'catalogCover', 'datePublished', 'dateModified', 'indexable']);
const metadata = value => Array.isArray(value) ? value.map(metadata) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).filter(([key]) => metadataFields.has(key))) : value;

// Keep missing translations missing: the application owns its existing fallback rules.
export function projectLanguage(value, language) {
  if (Array.isArray(value)) return value.map(item => projectLanguage(item, language));
  if (!value || typeof value !== 'object') return value;
  const localized = Object.keys(value).some(key => languages.includes(key));
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !localized || key === language || key === 'en' && !(language in value) || key === 'ru' && !(language in value) && !('en' in value))
    .map(([key, item]) => [key, projectLanguage(item, language)]));
}

export function compactOffer(offer) {
  const {editorial, ...facts} = offer;
  return {...facts, ...(editorial ? {editorial: {}} : {})};
}

const identifiers = node => {
  const names = new Set();
  const visit = item => {if (ts.isIdentifier(item)) names.add(item.text); ts.forEachChild(item, visit);};
  visit(node); return names;
};

/** @returns {import('vite').Plugin} */
export function clientContentPlugin() {
  let prepared;
  let repository;
  const prepare = () => prepared ||= (async () => {
    const file = path.join(repository, 'src/App.tsx');
    const text = await readFile(file, 'utf8');
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const declarations = new Map();
    for (const statement of ast.statements) if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) declarations.set(declaration.name.text, {statement, declaration});
    const graph = new Set();
    const visit = name => {
      if (graph.has(name) || !declarations.has(name)) return;
      graph.add(name); for (const dependency of identifiers(declarations.get(name).declaration.initializer)) visit(dependency);
    };
    roots.forEach(visit);
    const retained = new Set(roots);
    const preserve = name => {
      if (retained.has(name) || !graph.has(name)) return;
      retained.add(name); for (const dependency of identifiers(declarations.get(name).declaration.initializer)) preserve(dependency);
    };
    for (const statement of ast.statements) {
      if (ts.isImportDeclaration(statement)) continue;
      if (ts.isVariableStatement(statement) && statement.declarationList.declarations.every(item => graph.has(item.name.text))) continue;
      for (const name of identifiers(statement)) preserve(name);
    }
    const edits = [];
    for (const name of graph) {
      const {statement, declaration} = declarations.get(name);
      if (roots.includes(name)) edits.push([declaration.initializer.pos, declaration.initializer.end, ` clientContent.constants.${name}`]);
      else if (!retained.has(name)) edits.push([statement.getFullStart(), statement.end, '']);
    }
    let shell = text;
    for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) shell = shell.slice(0, start) + replacement + shell.slice(end);
    const body = ts.createSourceFile(file, shell, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const used = new Set();
    for (const statement of body.statements) if (!ts.isImportDeclaration(statement)) for (const name of identifiers(statement)) used.add(name);
    const imports = [];
    const importEdits = [];
    for (const statement of body.statements) {
      if (!ts.isImportDeclaration(statement) || !statement.moduleSpecifier.text.startsWith('./data/')) continue;
      const bindings = statement.importClause?.namedBindings?.elements.filter(item => used.has(item.name.text)) || [];
      const module = path.basename(statement.moduleSpecifier.text, '.js');
      imports.push({module, bindings: bindings.map(item => ({local: item.name.text, exported: item.propertyName?.text || item.name.text}))});
      importEdits.push([statement.getStart(), statement.end, bindings.length ? `import {${bindings.map(item => item.getText(body)).join(',')}} from ${JSON.stringify(statement.moduleSpecifier.text)};` : '']);
    }
    for (const [start, end, replacement] of importEdits.sort((a, b) => b[0] - a[0])) shell = shell.slice(0, start) + replacement + shell.slice(end);
    shell = `import {getClientContent} from './lib/clientContent';\nconst clientContent = getClientContent();\n` + shell;

    const data = await loadOffers({extraNames: roots.filter(name => !['OFFERS', 'OFFER_DESCRIPTION_TRANSLATIONS'].includes(name))});
    const entries = new Map(imports.filter(item => item.bindings.length && !liveModules.has(item.module)).map(item => [item.module, new Set(item.bindings.map(binding => binding.exported))]));
    // These two pure modules also need route/catalogue metadata, never article bodies.
    for (const module of ['indexPolicy', 'homePage']) {
      const source = ts.createSourceFile(module, await readFile(path.join(repository, `src/data/${module}.js`), 'utf8'), ts.ScriptTarget.Latest, true);
      for (const statement of source.statements) if (ts.isImportDeclaration(statement) && statement.moduleSpecifier.text.startsWith('./')) {
        const name = path.basename(statement.moduleSpecifier.text, '.js');
        if (!entries.has(name)) entries.set(name, new Set());
        for (const binding of statement.importClause?.namedBindings?.elements || []) entries.get(name).add(binding.propertyName?.text || binding.name.text);
      }
    }
    const modules = {};
    for (const [module, exports] of entries) {
      const bundle = await build({stdin: {contents: `export * from './${module}.js';`, resolveDir: path.join(repository, 'src/data'), loader: 'js'}, bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent'});
      const values = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
      modules[module] = Object.fromEntries([...exports].filter(name => typeof values[name] !== 'function').map(name => [name,
        name === 'seoLandingPages' ? values[name].map(page => ({route: page.route}))
        : /Pages$/.test(name) && name !== 'guidePages' ? values[name].map(page => ({id: page.id, slug: page.slug}))
        : /Article|Articles/.test(name) ? (Array.isArray(values[name]) ? values[name].map(page => ({id:page.id,slug:page.slug})) : {id:values[name].id,slug:values[name].slug})
        : /Meta$/.test(name) || name === 'guidePages' ? metadata(values[name]) : values[name]]));
    }
    const partner = await import('../src/data/partnerCardRefresh.js');
    const languageData = {};
    const services = {};
    const guideMetadata = Object.fromEntries(modules.guidePages.guidePages.map(page => [page.slug,page]));
    const guideRoutes = modules.guidePages.guidePages.map(({id,slug,indexable,datePublished,dateModified}) => ({id,slug,indexable,datePublished,dateModified}));
    for (const language of languages) {
      languageData[language] = projectLanguage({constants: Object.fromEntries(roots.map(name => [name, name === 'OFFERS' ? data.OFFERS.map(compactOffer) : name === 'SERVICE_PAGE_SEO_BY_ID' ? {} : data[name]])), modules}, language);
      // Guides remain Russian-only documents, including their runtime SEO on language copies.
      languageData[language].modules.guidePages = {guidePages:guideRoutes};
      for (const offer of data.OFFERS.filter(item => item.category !== 'Guides')) services[`${language}/${offer.id}`] = projectLanguage({...offer, __editorialLoaded: true, __partnerIntroduction: partner.getPartnerIntroduction(offer, language), __seo:data.SERVICE_PAGE_SEO_BY_ID[offer.id]}, language);
    }
    const collect = value => value == null ? [] : typeof value === 'object' ? Object.values(value).flatMap(collect) : [String(value)];
    const search = Object.fromEntries(data.OFFERS.map(offer => [offer.id, collect(offer).join(' ')]));
    return {shell, modules: entries, languageData, services, guideMetadata, search};
  })();
  return {
    name: 'client-content-boundaries', enforce: 'pre',
    configResolved(config) {repository = config.root;},
    async resolveId(id, importer) {
      if (id.startsWith('virtual:client-')) return '\0' + id;
      if (!importer || !id.includes('/data/') && !id.startsWith('./')) return;
      const parent = importer.replaceAll('\\', '/');
      const module = path.basename(id, '.js');
      if (parent.endsWith('/src/App.tsx') && id.startsWith('./data/') && !liveModules.has(module)
        || /\/src\/data\/(indexPolicy|homePage)\.js$/.test(parent) && id.startsWith('./')) return '\0virtual:client-module/' + module;
    },
    async load(id) {
      if (!id.startsWith('\0virtual:client-')) return;
      const data = await prepare();
      if (id === '\0virtual:client-loaders') return `export const loadSearch=()=>import('virtual:client-search');export const guides={${Object.keys(data.guideMetadata).map(key => `${JSON.stringify(key)}:()=>import(${JSON.stringify('virtual:client-guide-meta/' + key)})`).join(',')}};export const catalogues={${languages.map(language => `${language}:()=>import('virtual:client-catalogue/${language}')`).join(',')}};export const services={${Object.keys(data.services).map(key => `${JSON.stringify(key)}:()=>import(${JSON.stringify('virtual:client-service/' + key)})`).join(',')}};`;
      if (id === '\0virtual:client-search') return `export default ${JSON.stringify(data.search)};`;
      if (id.startsWith('\0virtual:client-guide-meta/')) return `export default ${JSON.stringify(data.guideMetadata[id.split('/').at(-1)])};`;
      if (id.startsWith('\0virtual:client-catalogue/')) return `export default ${JSON.stringify(data.languageData[id.split('/').at(-1)])};`;
      if (id.startsWith('\0virtual:client-service/')) return `export default ${JSON.stringify(data.services[id.split('/').slice(-2).join('/')])};`;
      const module = id.split('/').at(-1);
      const names = data.modules.get(module);
      let output = `import {getClientContent} from '/src/lib/clientContent.ts';const data=getClientContent().modules[${JSON.stringify(module)}];\n`;
      for (const name of names || []) {
        if (name === 'getPartnerIntroduction') output += `export const getPartnerIntroduction=offer=>offer.__partnerIntroduction;\n`;
        else output += `export const ${name}=data.${name};\n`;
      }
      return output;
    },
    async transform(code, id) {
      if (!id.replaceAll('\\', '/').endsWith('/src/App.tsx')) return;
      const data = await prepare();
      return {code: data.shell, map: null};
    },
    transformIndexHtml: {order: 'post', handler(html, context) {
      if (!context.bundle) return html;
      const chunks = Object.values(context.bundle).filter(item => item.type === 'chunk');
      const app = chunks.find(item => Object.keys(item.modules).some(id => id.replaceAll('\\', '/').endsWith('/src/App.tsx')));
      const catalogues = Object.fromEntries(languages.map(language => [language, chunks.find(item => item.facadeModuleId === '\0virtual:client-catalogue/' + language)?.fileName]));
      if (!app || Object.values(catalogues).some(file => !file)) throw new Error('Missing client entry for preload');
      const styles = [...(app.viteMetadata?.importedCss || [])].map(file => `<link rel="stylesheet" href="/${file}">`).join('');
      const scripts = [...new Set([app.fileName,...app.imports])].map(file => `<link rel="modulepreload" href="/${file}">`).join('');
      const catalogue = `<link rel="modulepreload" href="/${catalogues.ru}" data-client-catalogue ${languages.map(language => `data-client-catalogue-${language}="/${catalogues[language]}"`).join(' ')}>`;
      return html.replace(/<meta charset="[^"]+"\s*\/>/, match => match + catalogue + scripts + styles);
    }},
    handleHotUpdate(context) {
      if (/\/src\/(App\.tsx|data\/)/.test(context.file.replaceAll('\\', '/'))) {prepared = undefined; context.server.moduleGraph.invalidateAll(); context.server.ws.send({type: 'full-reload'});}
    },
  };
}
