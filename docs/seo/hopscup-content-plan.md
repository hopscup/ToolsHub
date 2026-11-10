# hopscup.tools: состояние проекта и контент-план

Обновлено: 29 октября 2026. Файл для продолжения работы в новой сессии (Claude) и для Codex.
Связанный файл: `docs/seo/hopscup-voice.md` (стиль автора + банк фактов).

## 1. Как мы работаем

- Claude ставит задачи и проверяет результат, Codex вносит правки в код (доступ к репозиторию только у Codex).
- Codex всегда сначала присылает diff и скриншоты; коммит и деплой только после ОК владельца.
- Тексты статей пишет Claude по сценариям в стиле автора, Codex только размещает готовый текст.
- Порядок сейчас: сначала довести внешний вид, тексты и размещение основных сервисов, статьи потом.
- Репозиторий `hopscup/ToolsHub` публичный; сделать приватным после основной работы.
- Яндекс Вебмастер не подключаем (решение владельца, юридические риски). Основной поиск через Google Search Console.

## 2. Главные партнёры (приоритет)

| Сервис | id в OFFERS | Промокод | Раздел |
|---|---|---|---|
| MobileProxy | p6 | hopscup −20% | /proxy-vpn |
| ProxyWing | p3 | hopscup −10% | /proxy-vpn |
| Proxy-Seller | p4 | hopscup −10% | /proxy-vpn |
| ProxyShard | p1 | hopscup | /proxy-vpn |
| DarkShopping | st-dark (URL /account-shop/darkstore) | нет данных | /account-shop |
| PGON | pgon | — | /foreign-cards |
| Zarub | zarub | — | /foreign-cards |

## 2а. Что сделано (ноябрь 2026)

- `8e7e246`: пакет индексации. Полные данные карточек в статике, «Альтернативы», короткие сводки на страницах разделов, ES/ZH/KO noindex с canonical на EN, новые H1/title /proxy-vpn и /antidetect, описания 4 прокси-партнёров, факты MobileProxy.
- Переписаны и опубликованы статьи: /proxy-vpn/luchshie-proksi, /guides/mobile-ip-airplane-mode, /proxy-vpn/luchshie-mobilnye-proksi (`4ee1b53`), /guides/kak-nastroit-antidetect-brauzer (`dec487f`), /guides/account-farm (`99a460e`), /guides/claude-iz-rossii-bez-bana.
- Общий подвал статей Hopscup Crew, чек-лист «Коротко: что делать» + «Где брать» в конце статей, без FAQ и блоков похожих статей. Даты статей фиксированные, не от даты сборки.
- /guides/crypto-otc-kyc: noindex, убрана из sitemap и статического каталога. Раздел с KYC-сервисами не дорабатываем.
- Добавлены сервисы: Antarctic Wallet (карты, крипта, Steam), QR2Pay (карты, крипта), вкладка «QR СБП» в крипте (PGON, Antarctic, QR2Pay, Prosto).
- В работе: Gmail, Discord по токену, зарубежная карта, UID (OKX основной, Bitget с 21.10.2026 не работает с РФ/РБ/КЗ) + обложки к ним.

Правила, принятые по ходу:
- Длинные тире «—» нигде не использовать.
- Скриншоты маскировать частично (видны первые и последние символы).
- FAQ не делаем (Google показывает FAQ-сниппеты почти только госсайтам и медицине). Блок похожих статей не делаем, но в тексте 2-3 ссылки на другие статьи.
- В конце статьи не пересказ, а короткий чек-лист действий и «Где брать» по 3 сервиса.
- Title до 60 символов, суффикс « | Hopscup».

## 3. Что сделано (октябрь 2026)

- `07fe28f`: статическая SEO-версия в `<noscript>` (убрана вспышка и скрытый текст 1×1).
- `7cdb649`: промокод ProxyShard `hoscup` → `hopscup`; DarkStore → DarkShopping в текстах и title; `rel="sponsored"` для партнёрских ссылок (`src/lib/externalLinks.js`); статический `/guides` теперь ссылается на 11 материалов.
- В работе: жёлтая звёздочка в правом верхнем углу карточек 7 партнёров (`src/data/recommendedOffers.js`), по клику поповер «Выбираю чаще всего» СЛЕВА от звезды. Не опубликовано.

## 4. Данные и выводы (28.10.2026)

- Vercel, 30 дней: ~2000 визитов с YouTube (95%), из поиска < 100 (Яндекс ~73, Google ~9).
- Top страниц: главная 966, /sms-activators 770, /antidetect 768, /account-shop 705, /proxy-vpn 578, /foreign-cards 392. Карточки MobileProxy, Proxy-Seller, ProxyWing, ProxyShard не в топ-14 → нужна заметность партнёров внутри разделов.
- Google Search Console: обвал 15–16.08.2026. Индекс 189 → 23 страницы, 217 «просканирована, не проиндексирована», показы ~0. Ручных санкций нет, проблем безопасности нет.
- Вероятные причины: массовые тонкие страницы (5 языков × ~100 карточек), скрытый текст (исправлен 28.10), тематика.
- Следующий SEO-шаг (не начат): сократить индекс до 40–60 сильных страниц (noindex слабых карточек и legacy-переводов), усилить оставшиеся.

## 5. Контент-план: сценарии → статьи

Правила для каждой статьи:
- Сценарий адаптируется в самостоятельную статью (без «в ролике», «в этом видео»), голос автора по `hopscup-voice.md`.
- Title/H1 под поисковый запрос, первый абзац сразу отвечает на него.
- Прямые реф-ссылки на сервисы (rel sponsored) + ссылки на разделы сайта («вся подборка прокси у меня на сайте» → /proxy-vpn и т.д.).
- Встроить ролик YouTube (ссылки на ролики запросить у владельца).
- Размещение: раздел /guides, статический HTML, sitemap, ссылки из соответствующих разделов.

### Новые статьи (по приоритету)

| # | Сценарий | Статья | Партнёры |
|---|---|---|---|
| 1 | https://telegra.ph/36236326236236326-10-01 | Как пользоваться Claude из России: регистрация, номер, оплата | ProxyWing, Proxy-Seller, ProxyShard (ISP), AdsPower/ShardX, SMS-Fast, PGON, Zarub, Лачуга |
| 2 | https://telegra.ph/kafcafcafcac4412-10-23 | Discord-ферма: где брать аккаунты, прокси и антидетект | DarkShopping, MobileProxy, ShardX/Donut, SMS-Fast/HeroSMS |
| 3 | https://telegra.ph/4161262166126126-09-03 | Бесплатные антидетект-браузеры 2026 (+ MCP/Codex автоматизация) | ProxyShard, ProxyWing, MobileProxy |
| 4 | https://telegra.ph/321125125215125215251152521-08-24 | ShardX: обзор бесплатного антидетекта от ProxyShard | ProxyShard, ProxyWing |
| 5 | https://telegra.ph/215125125215-09-22 + https://telegra.ph/e521fpfcpfcp-09-22 | YouTube-ферма: антидетект, прокси и проверка на теневой бан | Proxy-Seller, ProxyWing, ProxyShard, Proxyline |
| 6 | https://telegra.ph/fa4124124afawf-07-30 | Виртуальный номер для ChatGPT/Claude: HeroSMS и SMS-Fast | SMS-активаторы, Numera |
| 7 | https://telegra.ph/24515215251512551fa-07-21 | Дешёвые подписки ChatGPT, Claude, Gemini в Telegram-магазинах | Лачуга, Crassus, Апельсин, Петрович |
| 8 | https://telegra.ph/gag42j48u142152184651256261621-08-05 | Антидетект на телефоне: Android и iPhone | GoLogin, Octo, VMOS |
| 9 | https://telegra.ph/153215125125125-10-12 | AML-проверка кошелька и как очистить USDT | Keine Exchange, AML-чекеры |
| — | https://telegra.ph/afc52512512512515-08-17 | A6API, генерация картинок | не по теме сайта, пропускаем |

Заметки:
- 3 и 4 похожи, но разные запросы («бесплатный антидетект» vs «shardx»); карточка /antidetect/shardx уже 250 визитов/мес.
- 5 объединяет два сценария; теневой бан можно выделить в отдельную статью позже.
- MobileProxy: бесплатный тест в сценарии 10.2026 = 3 часа (в 2024 было 2 часа), перепроверить.

### Уже на сайте (не дублировать, можно обновлять)

| Источник | Страница |
|---|---|
| https://telegra.ph/51526126126216216-09-11 (карты PGON/ВездеКарта) | /guides/zarubezhnaya-karta-s-popolneniem-rublyami |
| https://teletype.in/@hopscupcrpt/GIuM0McUUie (ферма аккаунтов) | /guides/account-farm |
| https://teletype.in/@hopscupcrpt/gM3FcGi4Wn1 (OTC/KYC) | /guides/crypto-otc-kyc |
| https://teletype.in/@hopscupcrpt/iic_Q3_E19h (UID/адреса) | /guides/exchange-uids-addresses |
| https://telegra.ph/Smena-ajpi-mobilnym-internetom-i-rezhimom-samoleta-Android-i-Iphone-06-10 | /guides/mobile-ip-airplane-mode (владелец: «основная, в начало») |
| https://telegra.ph/Poshagovyj-gajd-po-nastrojke-pereadresacii-forvardinga-pisem-iz-Gmail-na-druguyu-pochtu-06-10 | /guides/gmail-forwarding (владелец: «основная, в начало») |

## 6. Открытые вопросы к владельцу

- Ссылки на YouTube-ролики к каждому сценарию.
- Что значит «основная, в начало» у гайдов про самолёт и Gmail (поставить первыми в /guides?).
- Промокод DarkShopping; личный опыт с ProxyShard и PGON для статей.
- Что ещё не нравится во внешнем виде сайта.
