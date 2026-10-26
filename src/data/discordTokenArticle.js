export const discordTokenArticle = {
  title: 'Как войти в Discord по токену: расширение и F12',
  description: 'Показываю вход через Discord Token Login и запасной способ через F12, если расширение не срабатывает. Разбираем, куда вставлять токен и как проверить результат.',
  sourceUrl: 'https://chromewebstore.google.com/detail/discord-token-login/kfjglmgfjedhhcddpfgfogkahmenikan',
  blocks: [
    { type: 'paragraph', content: [{ text: 'Есть токен Discord, но непонятно, куда его вставлять? В обычной форме входа для него нет отдельного поля. Для этого можно использовать расширение Discord Token Login, а если оно не срабатывает, попробовать вход через инструменты разработчика браузера.' }] },
    { type: 'paragraph', content: [{ text: 'Ниже оба способа со скриншотами. Начнём с расширения: там всё сводится к одному полю и кнопке. Затем покажу запасной вариант через F12 без установки дополнений.' }] },
    { type: 'heading', level: 2, text: 'Что такое токен Discord и где он в файле' },
    { type: 'paragraph', content: [{ text: 'Токен Discord относится к авторизованной сессии аккаунта. Это не никнейм, не ID пользователя и не обычный пароль. Он даёт доступ к аккаунту, поэтому его нельзя публиковать или отправлять посторонним.' }] },
    { type: 'paragraph', content: [{ text: 'Если данные аккаунта выданы файлом или строкой после покупки, сначала посмотрите описание формата у продавца. Например, строка может выглядеть как «почта:пароль:токен». Для входа через расширение нужна только часть с токеном, а не вся строка целиком. Порядок полей у разных продавцов может отличаться.' }] },
    { type: 'image', src: '/guides/discord-token/order.webp', alt: 'Пример строки с данными аккаунта Discord и выделенным полем токена', caption: 'Пример выданной строки: токен выделен в конце. Формат полей смотрите в описании заказа.' },
    { type: 'paragraph', content: [{ text: 'Копируйте токен целиком, без разделяющего двоеточия, лишних пробелов и переноса строки. В поле расширения вставляется сам токен. Двойные кавычки понадобятся только во втором способе, при заполнении Local Storage.' }] },
    { type: 'heading', level: 2, text: 'Как сменить токен Discord' },
    { type: 'paragraph', content: [{ text: 'Если хотите сменить токен Discord, просто смените пароль от аккаунта. Старый токен после этого перестанет работать.' }] },
    { type: 'paragraph', content: [{ text: 'Откройте настройки пользователя через шестерёнку рядом с профилем, затем «Моя учётная запись» → «Сменить пароль». Укажите текущий и новый пароль. Если включена двухфакторная аутентификация, потребуется код подтверждения. После смены пароля для входа по токену понадобится новый токен: сохранённый ранее в файле или расширении уже не подойдёт.' }] },
    { type: 'heading', level: 2, text: 'Как войти через Discord Token Login' },
    { type: 'list', ordered: true, items: [
      [{ text: 'Откройте ' }, { text: 'Discord Token Login в Chrome Web Store', href: 'https://chromewebstore.google.com/detail/discord-token-login/kfjglmgfjedhhcddpfgfogkahmenikan' }, { text: ' и установите расширение. Сверяйте название и адрес страницы с этой ссылкой.' }],
      [{ text: 'Перейдите на ' }, { text: 'страницу входа Discord', href: 'https://discord.com/login' }, { text: ' в том же браузере или профиле, куда установили расширение.' }],
      [{ text: 'Нажмите значок расширения справа от адресной строки. Если его не видно, откройте меню расширений со значком пазла и выберите Discord Token Login.' }],
      [{ text: 'В поле «Paste your Discord token here» вставьте только токен, без почты и пароля.' }],
      [{ text: 'Нажмите «Login to Discord» и дождитесь загрузки веб-версии.' }],
    ] },
    { type: 'image', src: '/guides/discord-token/extension.webp', alt: 'Поле Paste your Discord token here и кнопка Login to Discord в расширении', caption: 'Вставляем токен в единственное поле расширения, затем нажимаем Login to Discord.' },
    { type: 'paragraph', content: [{ text: 'Открылся интерфейс Discord, а внизу слева появился профиль нужного аккаунта? Значит, вход выполнен. Проверьте, что это именно тот аккаунт, в который вы собирались зайти.' }] },
    { type: 'image', src: '/guides/discord-token/success.webp', alt: 'Веб-версия Discord после входа с выделенным профилем внизу слева', caption: 'После входа виден интерфейс аккаунта и его профиль в левом нижнем углу.' },
    { type: 'paragraph', content: [{ text: 'Если кнопка ничего не делает или снова открывается форма входа, это ещё не доказывает, что токен нерабочий. Иногда не срабатывает само расширение. В таком случае можно попробовать следующий способ.' }] },
    { type: 'heading', level: 2, text: 'Вход по токену через F12, если расширение не работает' },
    { type: 'paragraph', content: [{ text: 'Наглядный пример входа по токену через F12 показывал в этом ' }, { text: 'пятиминутном ролике', href: 'https://youtu.be/DkJjFX7oRUc?si=TAArFZ3TQBTmOH2E' }, { text: '.' }] },
    { type: 'paragraph', content: [{ text: 'Этот вариант часто называют входом через консоль. Но здесь нам нужна вкладка ' }, { text: 'Application', strong: true }, { text: ' в инструментах разработчика, а не Console. Команды и скрипты вводить не будем: добавим одну запись в Local Storage.' }] },
    { type: 'paragraph', content: [{ text: 'Важно открыть именно ' }, { text: 'discord.com', href: 'https://discord.com/login' }, { text: ' и работать с хранилищем этого сайта. Если открыть F12 на странице магазина расширений или на другом домене, запись не попадёт в хранилище Discord.' }] },
    { type: 'list', ordered: true, items: [
      [{ text: 'Откройте discord.com/login. Нажмите F12. Если клавиша не срабатывает, попробуйте Fn + F12 или Ctrl + Shift + I в браузере на Windows.' }],
      [{ text: 'Перейдите во вкладку Application. В русскоязычном интерфейсе она может называться «Приложение». Если вкладка не помещается, найдите её в меню со стрелками ».' }],
      [{ text: 'В левой панели раскройте Storage → Local storage и выберите https://discord.com.' }],
      [{ text: 'Прокрутите таблицу вниз. Дважды нажмите на пустую строку, чтобы добавить запись. Если запись token уже есть, отредактируйте её значение.' }],
      [{ text: 'В левой колонке Key укажите token маленькими буквами, без кавычек.' }],
      [{ text: 'В правой колонке Value вставьте токен в обычных двойных кавычках. Схема записи: "ВАШ_ТОКЕН". Не используйте типографские кавычки «ёлочки» и не добавляйте почту или пароль.' }],
      [{ text: 'Нажмите Enter, чтобы сохранить значение, и перезагрузите страницу.' }],
      [{ text: 'Если открылась главная страница сайта, нажмите «Открыть Discord». Если сразу загрузился интерфейс аккаунта, дополнительный клик не нужен.' }],
    ] },
    { type: 'image', src: '/guides/discord-token/local-storage.webp', alt: 'Application, Local storage и запись token в хранилище https://discord.com', caption: 'Путь: Application → Local storage → https://discord.com. Ключ token слева, значение токена справа.' },
    { type: 'image', src: '/guides/discord-token/open-discord.webp', alt: 'Кнопка Открыть Discord на главной странице сайта', caption: 'Если после обновления открылась главная, переходим в веб-версию кнопкой «Открыть Discord».' },
    { type: 'paragraph', content: [{ text: 'Дальше проверка та же: должен открыться нужный аккаунт, а его профиль появится внизу слева. Это запасной способ, а не гарантия входа с любым токеном. Если сессия уже недействительна, запись в Local Storage её не восстановит.' }] },
    { type: 'heading', level: 2, text: 'Почему не получается войти по токену' },
    { type: 'list', ordered: false, items: [
      [{ text: 'Скопирована вся строка из файла. Отделите токен от почты, пароля и разделителей по формату выдачи.' }],
      [{ text: 'Токен обрезан или захвачен лишний символ. Проверьте начало и конец строки, пробелы и переносы.' }],
      [{ text: 'Перепутаны кавычки. Для расширения нужен сам токен, а для описанного способа через Local Storage значение записываем как "ВАШ_ТОКЕН".' }],
      [{ text: 'Выбран другой сайт в Local Storage. Нужен именно https://discord.com, в той вкладке и профиле браузера, где вы открываете Discord.' }],
      [{ text: 'Сессия недействительна или отозвана. Расширение и ручная запись не сделают такой токен действующим.' }],
      [{ text: 'Discord запрашивает дополнительную проверку аккаунта. Вход по токену не обещает обход таких проверок.' }],
    ] },
    { type: 'paragraph', content: [{ text: 'Начните с формата строки и копирования: это проще всего проверить. Если расширение не сработало, попробуйте вариант через F12. Если оба способа возвращают на вход, дальше проверяйте доступ к самому аккаунту, а не перебирайте случайные расширения.' }] },
    { type: 'heading', level: 2, text: 'Как достать токен из своего аккаунта Discord' },
    { type: 'paragraph', content: [{ text: 'Если вы уже вошли в свой аккаунт Discord и хотите получить его токен, это можно сделать через вкладку Network в браузере. Здесь нужен именно открытый аккаунт, а не страница с формой входа.' }] },
    { type: 'list', ordered: true, items: [
      [{ text: 'Откройте веб-версию Discord на discord.com и войдите в свой аккаунт.' }],
      [{ text: 'Нажмите F12 или Ctrl + Shift + I и перейдите во вкладку Network («Сеть»).' }],
      [{ text: 'Обновите страницу с открытой вкладкой Network, чтобы в списке появились запросы Discord.' }],
      [{ text: 'В поле Filter («Фильтр») введите api, как на скриншоте ниже.' }],
      [{ text: 'В колонке Name («Имя») найдите и откройте запрос science.' }],
      [{ text: 'В панели выбранного запроса откройте Headers («Заголовки»), затем найдите раздел Request Headers («Заголовки запроса»).' }],
      [{ text: 'Найдите строку Authorization. Значение справа от неё и есть токен вашей текущей сессии. Скопируйте его целиком, без слова Authorization.' }],
    ] },
    { type: 'paragraph', content: [{ text: 'Если запросов science несколько, выберите тот, у которого в Request Headers есть Authorization. Если science не появился, можно посмотреть другой запрос к discord.com/api/ с этим заголовком. Нужны именно заголовки запроса, не Response Headers («Заголовки ответа»).' }] },
    { type: 'image', src: '/guides/discord-token/network.webp', alt: 'Запрос science во вкладке Network и токен своего аккаунта Discord в строке Authorization', caption: 'Network → фильтр api → science → Headers → Request Headers → Authorization. Справа от Authorization находится токен аккаунта.' },
  ],
};

// Reuse the article text for the generated HTML before React starts.
export const discordTokenStaticArticle = discordTokenArticle.blocks.reduce((sections, block) => {
  if (block.type === 'heading' && block.level === 2) {
    sections.push({ heading: block.text, paragraphs: [], links: [] });
  } else {
    if (!sections.length) sections.push({ heading: 'Вход в Discord по токену', paragraphs: [], links: [] });
    const section = sections[sections.length - 1];
    if (block.type === 'paragraph') section.paragraphs.push(block.content.map(part => part.text).join(''));
    if (block.type === 'heading') section.paragraphs.push(block.text);
    if (block.type === 'list') block.items.forEach((item, index) => section.paragraphs.push(`${block.ordered ? `${index + 1}. ` : ''}${item.map(part => part.text).join('')}`));
    const segments = block.type === 'paragraph' ? block.content : block.type === 'list' ? block.items.flat() : [];
    segments.filter(part => part.href).forEach(part => section.links.push({ label: part.text, href: part.href }));
  }
  return sections;
}, []);
