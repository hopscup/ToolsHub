// Replaced by Vite for the browser; Node uses the date of the same build.
export const siteDateModified = typeof __SITE_BUILD_DATE__ === 'string' ? __SITE_BUILD_DATE__ : new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow' }).format(new Date());
