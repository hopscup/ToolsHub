import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { build } from 'esbuild';
import { createHash } from 'node:crypto';

// Read only the data dependency graph, never evaluate the React application.
export const loadOffers = async ({snapshot, extraNames = [], shellSignature = false} = {}) => {
  const file = path.resolve(snapshot?.root || process.cwd(), 'src/App.tsx');
  const source = ts.createSourceFile(file, snapshot ? snapshot.read(file) : await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declarations = new Map();
  const imports = new Map();
  for (const statement of source.statements) {
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) declarations.set(declaration.name.text, declaration);
    }
    if (ts.isImportDeclaration(statement)) for (const binding of statement.importClause?.namedBindings?.elements || []) {
      imports.set(binding.name.text, { statement, binding });
    }
  }
  const selected = new Set();
  const usedImports = new Set();
  const visitName = name => {
    if (selected.has(name)) return;
    const declaration = declarations.get(name);
    if (!declaration) {
      if (imports.has(name)) usedImports.add(name);
      return;
    }
    selected.add(name);
    const visit = node => {
      if (ts.isIdentifier(node)) visitName(node.text);
      ts.forEachChild(node, visit);
    };
    visit(declaration.initializer);
  };
  const exportedNames = ['OFFERS', 'CATEGORY_ROUTES', 'OFFER_DESCRIPTION_TRANSLATIONS', ...extraNames];
  for (const name of exportedNames) {
    if (!declarations.has(name)) throw Error(`Missing offer data declaration: ${name}`);
    visitName(name);
  }
  const printer = ts.createPrinter();
  const lines = [];
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const bindings = (statement.importClause?.namedBindings?.elements || []).filter(binding => usedImports.has(binding.name.text));
      if (!bindings.length) continue;
      const module = statement.moduleSpecifier.text;
      if (!module.startsWith('./data/')) throw Error(`Unexpected non-data offer dependency: ${module}`);
      lines.push(`import { ${bindings.map(binding => binding.getText(source)).join(', ')} } from ${JSON.stringify(module)};`);
    }
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
      if (selected.has(declaration.name.text)) lines.push(`const ${printer.printNode(ts.EmitHint.Unspecified, declaration, source)};`);
    }
  }
  lines.push('export { ' + exportedNames.join(', ') + ' };');
  if (shellSignature) {
    const shell = source.statements.filter(statement => {
      if (ts.isImportDeclaration(statement)) return !statement.moduleSpecifier.text.startsWith('./data/');
      return !ts.isVariableStatement(statement) || statement.declarationList.declarations.some(item => !selected.has(item.name.text));
    }).map(statement => statement.getText(source)).join('\n');
    lines.push('export const appShellSignature = ' + JSON.stringify(createHash('sha256').update(shell).digest('hex')) + ';');
  }
  const result = await build({ stdin: { contents: lines.join('\n'), resolveDir: path.dirname(file), loader: 'ts' }, plugins: snapshot ? [snapshot.plugin] : [], bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
};
