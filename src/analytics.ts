import { track as trackVercelEvent } from '@vercel/analytics';

const MEASUREMENT_ID = 'G-W3M6HF3T1X';
const CONSENT_STORAGE_KEY = 'hopscup-analytics-consent';
const ATTRIBUTION_STORAGE_KEY = 'hopscup-attribution';

export type AnalyticsConsent = 'granted' | 'denied' | null;
export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let analyticsInitialized = false;
let analyticsConfigured = false;
let lastTrackedPage = '';

const getAttributionParams = (): AnalyticsEventParams => {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const currentAttribution = {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    referrer_host: document.referrer ? new URL(document.referrer).hostname : undefined,
  };
  const hasCampaign = Object.values(currentAttribution).some(Boolean);

  if (hasCampaign) {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(currentAttribution));
    return currentAttribution;
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || '{}') as AnalyticsEventParams;
  } catch {
    return {};
  }
};

const ensureGoogleTagQueue = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
};

const setDefaultConsent = () => {
  ensureGoogleTagQueue();
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
};

const initializeGoogleAnalytics = () => {
  if (analyticsInitialized || typeof window === 'undefined') return;

  setDefaultConsent();

  if (!document.querySelector('script[data-hopscup-analytics="true"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.dataset.hopscupAnalytics = 'true';
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  analyticsInitialized = true;
};

export const getAnalyticsConsent = (): AnalyticsConsent => {
  if (typeof window === 'undefined') return null;

  const savedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return savedConsent === 'granted' || savedConsent === 'denied' ? savedConsent : null;
};

export const updateAnalyticsConsent = (consent: Exclude<AnalyticsConsent, null>) => {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  if (consent === 'denied') lastTrackedPage = '';

  if (consent === 'granted') {
    initializeGoogleAnalytics();
  } else {
    ensureGoogleTagQueue();
  }

  window.gtag('consent', 'update', {
    analytics_storage: consent,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  if (consent === 'granted' && !analyticsConfigured) {
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
    });
    analyticsConfigured = true;
  }
};

export const initializeAnalyticsFromConsent = () => {
  if (getAnalyticsConsent() === 'granted') {
    updateAnalyticsConsent('granted');
  }
};

export const trackAnalyticsEvent = (eventName: string, params: AnalyticsEventParams = {}) => {
  const eventParams = {
    ...getAttributionParams(),
    page_path: typeof window === 'undefined' ? undefined : window.location.pathname,
    ...params,
  };

  trackVercelEvent(eventName, eventParams);

  if (getAnalyticsConsent() !== 'granted') return;

  initializeGoogleAnalytics();
  window.gtag('event', eventName, eventParams);
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (getAnalyticsConsent() !== 'granted' || lastTrackedPage === pagePath) return;

  lastTrackedPage = pagePath;
  initializeGoogleAnalytics();
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: pageTitle,
    ...getAttributionParams(),
  });
};
