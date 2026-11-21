import assert from 'node:assert/strict';
import test from 'node:test';
import { getExternalLinkRel, isAffiliateUrl, isTelegramUrl } from './externalLinks.js';

test('Telegram bot destinations recognize both official host spellings', () => {
  for (const url of ['https://t.me/QuattroVPN_BOT', 'https://telegram.me/QuattroVPN_BOT', 'https://www.telegram.me/QuattroVPN_BOT']) assert.equal(isTelegramUrl(url), true);
  for (const url of ['https://quattro.app/', 'https://telegram.me.example.com/bot', '/t.me/example', undefined]) assert.equal(isTelegramUrl(url), false);
});

test('referral query parameters and existing path referrals are sponsored', () => {
  for (const href of [
    'https://shardx.com/?ref=hopscup',
    'https://dark.shopping/category/view/gmail?p=95083',
    'https://proxy-seller.com/?partner=RIPC5NDAEYRZPZ',
    'https://dashboard.proxywing.com/billing/aff.php?aff=813',
    'https://gglead.org/go20580',
    'https://proxy6.net/?r=103460',
    'https://proxys.io/?refid=54507',
    'https://lis-skins.com/?rf=3576023',
    'https://proxyline.net/?line=152448',
    'https://socpublic.com/?i=9368855',
    'https://www.morelogin.com/?from=AA8n0exLQF5U',
    'https://accsmarket.com/en/9vV7VOzI',
    'https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd',
    'https://twiboost.com/ref2287193',
    'https://partner.soc-proof.su/',
    'https://gologin.com/join/hopscup-IOKNLPB',
    'https://incogniton.com/aff/1873747/',
    'https://www.adspower-ru.com/share/e1UrIy',
    'https://okx.com/join/8471428',
    'https://t.me/allvpn?start=refBCRyVZUr',
    'https://t.me/pgon?start=ref_1ob10bl6',
    'https://t.me/antarctic_wallet_bot/app?startapp=ref_d5c6b79c1d',
    'https://t.me/QR2Pay_bot?start=dobr9kcoo_ref_HgOnjPB',
    'https://t.me/example_bot/app?startapp=REF_example',
    'https://t.me/iMP_VPN_bot?start=6532969757',
    'https://t.me/VPNPPLBot?start=dXNlcl9pZD00NDMwODM',
    'https://t.me/KYCBLOCKBOT?start=HOPSCUP',
    'https://t.me/BolotoAI?start=r_467483565',
    'https://t.me/taynikstore_bot?start=ref467483565',
    'https://t.me/AhlisShop_bot?start=467483565',
    'https://ls.app/sign-up?promo=hopscup',
    'https://telegram.me/QuattroVPN_BOT?start=r_QTvaoAABoVcA2Pbb',
    'https://t.me/QuattroVPN_BOT?start=r_QTvaoAABoVcA2Pbb',
    'https://quattro.app/register?ref=QTvaoAABoVcA2Pbb',
    'https://t.me/vpntaynik_bot?start=ref467483565',
  ]) {
    assert.equal(isAffiliateUrl(href), true, href);
    assert.equal(getExternalLinkRel(href), 'sponsored noopener noreferrer', href);
  }
});

test('ordinary external resources are not sponsored', () => {
  for (const href of [
    'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ru',
    'https://github.com/ProxyShard/ShardBrowser',
    'https://amlbot.com/',
    'https://www.youtube.com/@hopscup',
    'https://youtu.be/DkJjFX7oRUc?si=TAArFZ3TQBTmOH2E',
    'https://pixelscan.net/',
    'https://t.me/hopscupcrpt',
    'https://t.me/thehermesex',
    'https://t.me/example_bot?start=help',
    'https://t.me/example_bot?start=467483565',
    'https://t.me/example_bot?start=r_467483565',
    'https://t.me/BolotoAI',
    'https://t.me/AhlisShop_bot',
    'https://t.me/AhlisShop_bot?start=help',
    'https://t.me/BolotoAI?start=help',
    'https://telegram.me/QuattroVPN_BOT',
    'https://telegram.me/QuattroVPN_BOT?start=help',
    'https://telegram.me/example_bot?start=r_example',
    'https://quattro.app/',
    'https://ls.app/',
    'https://example.com/?promo=hopscup',
    'https://t.me/example_bot/app?startapp=help',
    'https://t.me/example_bot/app?startapp=',
    'https://funpay.com/',
    'https://gglead.org/',
    'https://example.com/?from=article',
  ]) {
    assert.equal(isAffiliateUrl(href), false, href);
    assert.equal(getExternalLinkRel(href), 'noopener noreferrer', href);
  }
});

test('internal, missing and non-HTTP links do not gain an external rel', () => {
  for (const href of ['/guides', '#steps', undefined, '', 'javascript:void(0)', 'mailto:test@example.com']) {
    assert.equal(isAffiliateUrl(href), false);
    assert.equal(getExternalLinkRel(href), undefined);
  }
  assert.equal(isAffiliateUrl('https://hopscup.tools/proxy-vpn?ref=internal'), false);
});
