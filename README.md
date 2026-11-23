
# Hopscup's Tools Hub

A curated directory of services that Hopscup uses for accounts, proxies, antidetect browsers, digital products, payments, servers, and everyday online work.

## Website

- [Hopscup's Tools Hub](https://hopscup.tools/)
- [Proxies for accounts and antidetect browsers](https://hopscup.tools/proxy-vpn/dlya-akkauntov)
- [Antidetect browser comparison](https://hopscup.tools/antidetect/kakoy-vybrat)

The website is available in Russian, English, Spanish, Chinese, and Korean.

## Testing

After installing dependencies and building the production output, run the full test gate:

```sh
npm ci
npm run build
npm test
```

`npm test` runs unit tests followed by `npm run test:content`, the mandatory real-browser audit of every generated static and React page in all five languages. Unit tests alone (`node --test scripts/*.test.mjs`) are not a substitute for this gate.

The browser audit uses the pinned Playwright 1.62.1 development dependency. On Windows it uses an installed Microsoft Edge from Program Files automatically. On other systems, or without Edge, install Chromium with `npm exec playwright install chromium`. Set `CONTENT_AUDIT_BROWSER_EXECUTABLE` to select another browser executable explicitly.

To keep generated evidence outside the repository, set an output directory before running the tests:

```powershell
$env:CONTENT_REGRESSION_REPORT = 'C:/absolute/path/to/content-regression'
npm test
```

The audit starts its own temporary static server for `dist`; no preview process or production access is needed. Do not rebuild or edit application data during the run. Missing fields, referral links, author introductions or external-link parity cause a nonzero exit. See [the audit guide](scripts/content-regression.README.md) for expectations, diagnostic modes and report files.
