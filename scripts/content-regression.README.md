# Content Regression Audit

These scripts do not build, edit application data, contact production, deploy or submit IndexNow requests.

## Commands

Run from the repository root after a stable production build:

```powershell
npm test
```

The required gate is configured in package.json:

```json
"test": "node --test scripts/*.test.mjs && npm run test:content",
"test:content": "node scripts/content-regression-browser.mjs"
```

For engine unit tests alone use `node --test scripts/content-regression.test.mjs`. Standalone inventory is available with `node scripts/content-regression-inventory.mjs`. Neither is a full browser pass.

The full browser command has no language flags. It audits every generated HTML page, including noindex pages, in RU/EN/ES/ZH/KO. It starts its own temporary static server against `dist`, serves exact emitted routes, disables caching, blocks all external requests and closes its server/browser on completion. It does not depend on the Vite preview port.

Environment:

```powershell
$env:CONTENT_AUDIT_BROWSER_MODULE = 'file:///absolute/path/to/playwright/index.mjs'
$env:CONTENT_AUDIT_BROWSER_EXECUTABLE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
$env:CONTENT_REGRESSION_REPORT = 'C:/absolute/path/outside/repository/content-regression'
node scripts/content-regression-browser.mjs
```

`playwright` is the default module when the environment override is absent. On Windows an existing Microsoft Edge installation under Program Files is selected through `channel: msedge`; there is no dependency on a user-specific runtime path. Other systems use Playwright Chromium. Install it with `npm exec playwright install chromium`, or set `CONTENT_AUDIT_BROWSER_EXECUTABLE` explicitly. Existing `SEO_AUDIT_BROWSER_MODULE` and `SEO_AUDIT_BROWSER_EXECUTABLE` are also accepted.

Diagnostic-only modes:

```powershell
node scripts/content-regression-browser.mjs --static-only
node scripts/content-regression-browser.mjs --service-languages=ru,en
```

The latter still tests static pages and article/section external-link parity in all five languages. Only service-card React checks are narrowed. A partial run records `complete: false` and the exact `unexecutedReactRoutes`; it is not evidence of a full pass. There are no per-service skips or expected-failure lists. Missing content gives exit code 1.

## Expectations

- Service cards are every `OFFERS` entry with a slug except category `Guides`. Guides are covered as content pages instead. Unknown categories, duplicate routes and missing static routes are errors.
- Main `url` and optional `webUrl` must be anchors. Their `sponsored` policy must match `isAffiliateUrl`, including ordinary GitHub/FunPay URLs remaining non-sponsored. Referral query parameters and hashes are not discarded.
- Promo code and every nonempty `details`/`cardStats` leaf are inventoried directly from data, not from `getServiceFacts` or a renderer field allowlist. Unknown future fields are included. cardStats values must appear in their own labeled/keyed row, not only elsewhere in the popup.
- Author introduction follows `getPartnerIntroduction || offerDescription`, including own/manual language descriptions and the existing localized fallback. Static and React must contain the same selected UI introduction, not independently selected captions. A standalone `editorial.description` not chosen by that contract is logged in `unusedEditorialDescriptions`, not mistaken for an author paragraph. This does not mean adapted first-person copy is metadata: its role is determined by the selected source. The first author paragraph is checked in the introduction block, not in metadata, alternatives or an unrelated paragraph.
- Static copy explicitly applies the existing `plainSeoText` dash conversion. Each affected expectation retains `sourceValue` and `transformation: plainSeoText`; this is not missing-field suppression. Other punctuation, words, prices and values are not rewritten by the audit. React expectations retain the source copy.
- Every external anchor in the complete noscript article/section is required in React, including navigation/footer links. The audit excludes no domains or placements. Normal URL serialization is allowed, but it does not remove referral parameters or hashes. An iframe is not an anchor and cannot satisfy a missing link.
- Static HTML is parsed with a real browser DOMParser in an inert document. React is inspected after mounting; noscript/script/style/template nodes are removed from inspection. Service scope is its popup, excluding alternatives and the underlying catalog.
- Inventory source and dist fingerprints are compared after the run. A concurrent source edit/build invalidates evidence and requires a fresh run. The scripts never rebuild dist automatically.

## Evidence

`inventory.json` enumerates all services, languages, source-derived fields, author provenance, unused editorial descriptions and emitted pages. `errors.jsonl` is appended during execution, so defects can be inspected before completion. `static-defects.json` is available before React checks start. `results.json` and `defects.csv` contain complete findings, coverage and unexecuted routes. `external-link-parity.json` records expected/actual/missing external URLs for each article and section.

Unit tests verify the audit engine with deliberate removals of every field, both service links, sponsored tokens, author blocks and external URLs, including duplicate-value traps. They do not replace the real browser command or its report.
