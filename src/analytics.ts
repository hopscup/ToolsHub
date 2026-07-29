const MEASUREMENT_ID = 'G-W3M6HF3T1X';
const CONSENT_STORAGE_KEY = 'hopscup-analytics-consent';

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
  if (getAnalyticsConsent() !== 'granted') return;

  initializeGoogleAnalytics();
  window.gtag('event', eventName, params);
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (getAnalyticsConsent() !== 'granted' || lastTrackedPage === pagePath) return;

  lastTrackedPage = pagePath;
  trackAnalyticsEvent('page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: pageTitle,
  });
};
