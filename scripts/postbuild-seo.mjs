import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://hopscup.tools';
const distDir = path.resolve('dist');

const pages = [
  {
    route: '/proxy-vpn',
    title: 'Прокси и VPN для аккаунтов, фарма и работы | Hopscup Tools',
    description: 'Подборка прокси и VPN: residential, mobile, ISP, IPv4/IPv6, сервисы с оплатой картой и криптой для аккаунтов, рекламы и автоматизации.',
  },
  {
    route: '/antidetect',
    title: 'Антидетект браузеры для мультиаккаунтинга | Hopscup Tools',
    description: 'Сравнение антидетект браузеров: бесплатные профили, стартовые тарифы, цена за 100 профилей и варианты для базовых и усиленных задач.',
  },
  {
    route: '/account-shop',
    title: 'Магазины аккаунтов и подписок | Hopscup Tools',
    description: 'Подборка сайтов и Telegram-магазинов для покупки аккаунтов, AI-подписок, Discord, Twitter, Google и других цифровых товаров.',
  },
  {
    route: '/foreign-cards',
    title: 'Зарубежные карты без KYC и с KYC | Hopscup Tools',
    description: 'Сервисы зарубежных виртуальных карт для оплаты зарубежных подписок, App Store, Google Play, Airbnb, рекламы и других сервисов.',
  },
  {
    route: '/crypto-exchange',
    title: 'Купить и продать крипту онлайн и офлайн | Hopscup Tools',
    description: 'Обменники для покупки и продажи криптовалюты: онлайн-обмен, офлайн-направления, наличные, карты, USDT и популярные сети.',
  },
  {
    route: '/sms-activators',
    title: 'SMS-активаторы для регистрации аккаунтов | Hopscup Tools',
    description: 'SMS-активаторы и виртуальные номера для регистрации аккаунтов: гео, способы оплаты, крипта, карты и российские способы пополнения.',
  },
  {
    route: '/vps',
    title: 'VDS и VPS серверы для ботов и рабочих задач | Hopscup Tools',
    description: 'Подборка VDS/VPS хостингов для ботов, скриптов, парсинга, нод и удаленной работы: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
  },
  {
    route: '/social-boost',
    title: 'Накрутка и буксы для рефералов и заданий | Hopscup Tools',
    description: 'Сайты накрутки и буксы для рефералов, регистраций, социальных действий и Telegram-заданий с оплатой картой, СБП/Мир и криптой.',
  },
  {
    route: '/steam-topup',
    title: 'Пополнение Steam из РФ и через предметы | Hopscup Tools',
    description: 'Способы пополнения Steam: по логину, через предметы CS/TF/Rust, пополнение из РФ, быстрые варианты и пополнение в плюс до 30%.',
  },
  {
    route: '/guides',
    title: 'Полезные гайды по аккаунтам, IP, Gmail и крипте | Hopscup Tools',
    description: 'Гайды Hopscup по смене IP, Gmail-форвардингу, ферме аккаунтов, KYC/OTC площадкам, UID и адресам для бирж.',
  },
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const replaceMeta = (html, page) => {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const url = `${siteUrl}${page.route}`;

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`);
};

const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');

await Promise.all(
  pages.map(async (page) => {
    const routeDir = path.join(distDir, page.route);
    await mkdir(routeDir, { recursive: true });
    await writeFile(path.join(routeDir, 'index.html'), replaceMeta(indexHtml, page), 'utf8');
  }),
);

await writeFile(
  path.join(distDir, 'index.html'),
  replaceMeta(indexHtml, pages[0]),
  'utf8',
);
