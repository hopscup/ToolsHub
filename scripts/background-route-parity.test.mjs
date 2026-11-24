import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import ts from 'typescript';

function darkDesktopEffect(code) {
  const source = ts.createSourceFile('background.tsx',code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  let body;
  const find = node => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'useEffect' && !body) body = node.arguments[0].body;
    ts.forEachChild(node,find);
  };
  find(source);
  // Ignore only the approved light palette. All dark canvas drawing stays locked.
  const result = ts.transform(body,[context => {
    const visit = node => {
      if (ts.isVariableStatement(node) && node.declarationList.declarations.some(item => ['isLight','themeObserver'].includes(item.name.getText(source)))) return undefined;
      if (ts.isExpressionStatement(node) && node.expression.getText(source).startsWith('themeObserver.')) return undefined;
      if (ts.isConditionalExpression(node) && node.condition.getText(source) === 'isLight') return ts.visitNode(node.whenFalse,visit);
      return ts.visitEachChild(node,visit,context);
    };
    return node => ts.visitNode(node,visit);
  }]);
  const printed = ts.createPrinter({removeComments:true}).printNode(ts.EmitHint.Unspecified,result.transformed[0],source).replace(/\s+/g,' ').trim();
  result.dispose();
  return createHash('sha256').update(printed).digest('hex');
}

test('desktop canvas drawing remains identical to the a5289c8 reference',async()=>{
  const source = await readFile('src/components/BackgroundParticles.tsx','utf8');
  assert.equal(darkDesktopEffect(source),'807c3bd31d053c5b582be8fa59802149fc916093f71998b1c4d769289ddc8bcf');
  assert.ok(source.includes('sm:blur-[1px]'));
  assert.ok(source.includes("mixBlendMode: 'overlay', opacity: 0.4"));
  assert.ok(source.includes("'(max-width: 767px), (max-width: 1023px) and (pointer: coarse)'"));
});

test('home and catalogue share one background and mobile has no CSS meteor layer',async()=>{
  const app=await readFile('src/App.tsx','utf8'),css=await readFile('src/theme.css','utf8');
  assert.equal((app.match(/<BackgroundParticles\s*\/>/g)||[]).length,1);
  for(const file of ['HomeHero.tsx','HomeHub.tsx']){
    const source=await readFile('src/components/'+file,'utf8');
    assert.ok(!/BackgroundParticles|<canvas|meteor|shooting/i.test(source));
  }
  assert.ok(!/site-mobile-sky\s*(?:>|\s)\s*i\b|site-meteor|site-mobile-twinkles/.test(css));
  const generator=await readFile('scripts/generate-mobile-sky.mjs','utf8');
  assert.ok(generator.includes('i<155'));assert.ok(generator.includes('i<450'));
});
