import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import test from 'node:test';
import ts from 'typescript';
import {build} from 'esbuild';
import {loadOffers} from './load-offers.mjs';
import {getServiceFacts, localizedServiceValue} from '../src/data/servicePresentation.js';

const {OFFERS} = await loadOffers();
const cards = OFFERS.filter(offer => offer.cardStats);
const source = ts.createSourceFile('App.tsx', await readFile('src/App.tsx', 'utf8') + await readFile('src/components/ServiceModal.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const fragments = new Map();
const visit = node => {
  if (ts.isJsxExpression(node) && node.expression) {
    for (const name of ['offer', 'selectedOffer']) {
      if (node.expression.getText(source).startsWith(`${name}.cardStats &&`)) fragments.set(name, node.expression.getText(source));
    }
  }
  ts.forEachChild(node, visit);
};
visit(source);

// Render the actual catalogue/modal facts fragments, including promo-aware issuance rows.
const renderers = new Map();
for (const [name, expression] of fragments) {
  const compiled = await build({
    stdin: {loader: 'tsx', resolveDir: process.cwd(), contents: `
      import React from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import {Check, Copy} from 'lucide-react';
      export const render = (${name}, language) => {
        const l = value => value?.[language] ?? value?.en ?? value ?? '';
        const tx = l;
        const t = new Proxy({}, {get: (_, key) => String(key)});
        const copiedPromoId = null;
        const copyToClipboard = () => {};
        return renderToStaticMarkup(<>{${expression}}</>);
      };
    `},
    bundle: false, platform: 'node', format: 'cjs', write: false, logLevel: 'silent',
  });
  const module = {exports: {}};
  new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
  renderers.set(name, module.exports.render);
}

const statRow = (html, key) => {
  const start = html.search(new RegExp(`<div[^>]*data-card-stat="${key}"`));
  if (start < 0) return '';
  const tail = html.slice(start);
  let depth = 0;
  for (const tag of tail.matchAll(/<\/?div\b[^>]*>/g)) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (!depth) return tail.slice(0, tag.index + tag[0].length);
  }
  return '';
};

test('all card commissions render in the real tile and popup/direct-page JSX, RU and EN', () => {
  assert.deepEqual([...renderers.keys()].sort(), ['offer', 'selectedOffer']);
  assert.ok(cards.length >= 7);
  for (const language of ['ru', 'en']) for (const card of cards) {
    for (const [name, render] of renderers) {
      const row = statRow(render(card, language), 'commission');
      assert.ok(row.includes(language === 'ru' ? 'Комиссия' : 'Commission'), `${card.id}/${language}/${name}: label`);
      assert.ok(row.includes(localizedServiceValue(card.cardStats.commission, language)), `${card.id}/${language}/${name}: commission`);
    }
    assert.ok(getServiceFacts(card, language).some(fact => fact.key === 'commission'));
  }
});

test('PGON QR payments use the shared card-stat list without a standalone types fact', () => {
  const card = OFFERS.find(offer => offer.id === 'pgon');
  const exchange = OFFERS.find(offer => offer.id === 'pgon-exchange');
  assert.equal(card.details.types, undefined);
  assert.equal(exchange.cardStats?.qrPayments, undefined);
  assert.equal(card.cardStats.qrPayments.ru, 'РФ и за границей');
  assert.equal(card.cardStats.qrPayments.en, 'Russia and abroad');
  for (const language of ['ru', 'en']) {
    for (const render of renderers.values()) {
      const row = statRow(render(card, language), 'qrPayments');
      assert.ok(row.includes(language === 'ru' ? 'QR-оплата' : 'QR payments'));
      assert.ok(row.includes(card.cardStats.qrPayments[language]));
    }
    const facts = getServiceFacts(card, language);
    assert.equal(facts.filter(fact => fact.key === 'qrPayments').length, 1);
    assert.equal(facts.filter(fact => fact.key === 'types').length, 0);
    assert.ok(getServiceFacts(card, language).some(fact => fact.key === 'qrPayments'));
    assert.ok(exchange.editorial.description[language].includes(language === 'ru' ? 'Таиланд' : 'Thailand'));
    assert.ok(card.editorial.capabilities[language].some(text => text.includes(language === 'ru' ? 'Таиланд' : 'Thailand')));
  }
});

test('built noscript includes card commissions in direct pages and section summaries', async () => {
  for (const language of ['ru', 'en']) {
    const prefix = language === 'ru' ? '' : '/en';
    const section = (await readFile(`dist${prefix}/foreign-cards/index.html`, 'utf8')).match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
    for (const card of cards) {
      const page = (await readFile(`dist${prefix}/foreign-cards/${card.slug}/index.html`, 'utf8')).match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
      const commission = localizedServiceValue(card.cardStats.commission, language);
      const label = language === 'ru' ? 'Комиссия' : 'Commission';
      assert.ok(page?.includes(`<dt>${label}</dt><dd>${commission}</dd>`), `${card.id}/${language}: page`);
      const summary = section?.match(new RegExp(`<section data-service-summary="${card.id}">([\\s\\S]*?)</section>`))?.[1];
      assert.ok(summary?.includes(`<dt>${label}</dt><dd>${commission}</dd>`), `${card.id}/${language}: summary`);
      if (card.id === 'pgon') {
        const label = language === 'ru' ? 'QR-оплата' : 'QR payments';
        assert.ok(page.includes(`<dt>${label}</dt><dd>${card.cardStats.qrPayments[language]}</dd>`));
        assert.ok(summary.includes(`<dt>${label}</dt><dd>${card.cardStats.qrPayments[language]}</dd>`));
        assert.ok(!page.includes(`<dt>${language === 'ru' ? 'Типы' : 'Types'}</dt>`));
      }
    }
  }
});
