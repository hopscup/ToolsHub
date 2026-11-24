export const blockedAnalyticsPatterns = [
  '*cloudflareinsights.com*', '*/_vercel/insights*', '*/_vercel/speed-insights*',
  '*vercel-insights.com*', '*google-analytics.com*', '*googletagmanager.com*',
];

export function isAnalyticsUrl(value) {
  const {hostname,pathname} = new URL(value);
  return ['cloudflareinsights.com','vercel-insights.com','google-analytics.com','googletagmanager.com']
    .some(domain => hostname === domain || hostname.endsWith('.' + domain))
    || /^\/_vercel\/(?:insights|speed-insights)(?:\/|$)/.test(pathname);
}

// Neutralize the workstation's injected script, without changing antivirus settings.
export const isWorkstationInjectionUrl=value=>new URL(value).hostname==='me.kis.v2.scr.kaspersky-labs.com';

// An empty local response prevents both tracking and expected blocked-script console errors.
export const fulfillBlockedAnalytics = route => route.fulfill({
  status:200, contentType:'application/javascript', body:'',
  headers:{'access-control-allow-origin':'*','cache-control':'no-store'},
});
