import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,readdir,access} from 'node:fs/promises';
import ts from 'typescript';

const pkg=JSON.parse(await readFile('package.json','utf8'));
const removed=['express','@types/express','dotenv','@google/genai'];
const tools=['vite','@vitejs/plugin-react','@tailwindcss/vite'];

test('unused AI Studio dependencies are absent and build tools are devDependencies only',async()=>{
  for(const name of removed)assert.ok(!pkg.dependencies?.[name]&&!pkg.devDependencies?.[name],name);
  for(const name of tools){assert.ok(pkg.devDependencies[name],name);assert.ok(!pkg.dependencies[name],name);}
  const vite=JSON.parse(await readFile('node_modules/vite/package.json','utf8'));
  assert.match(vite.version,/^6\./);
  assert.match(pkg.devDependencies.vite,/^[~^]?6\./);
  const lock=JSON.parse(await readFile('package-lock.json','utf8'));
  for(const name of tools)assert.equal(lock.packages['node_modules/'+name].dev,true,name);
});

test('source, scripts and Vite configuration have no imports of removed template packages',async()=>{
  const files=['vite.config.ts'];
  for(const root of ['src','scripts'])for(const file of await readdir(root,{recursive:true}))if(/\.(?:mjs|cjs|js|ts|tsx)$/.test(file))files.push(root+'/'+file);
  for(const file of files){
    const source=ts.createSourceFile(file,await readFile(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const visit=node=>{
      let value;
      if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))value=node.moduleSpecifier.text;
      if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||ts.isIdentifier(node.expression)&&node.expression.text==='require')&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0]))value=node.arguments[0].text;
      if(value)for(const name of removed)assert.ok(value!==name&&!value.startsWith(name+'/'),file+': '+value);
      ts.forEachChild(node,visit);
    };
    visit(source);
  }
});

test('unused Gemini env injection and server template references are removed',async()=>{
  const config=await readFile('vite.config.ts','utf8');
  assert.doesNotMatch(config,/GEMINI_API_KEY|loadEnv/);
  assert.ok(config.includes('__SITE_BUILD_DATE__'));
  for(const file of ['.env.example','README.md','metadata.json'])assert.doesNotMatch(await readFile(file,'utf8'),/GEMINI_API_KEY/);
  assert.ok(!pkg.scripts.clean.includes('server.js'));
  await assert.rejects(access('server.js'),{code:'ENOENT'});
});
