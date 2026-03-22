import { hasConsentFor } from "./consentModel.js";

const EVENT = "rs-consent-change";

/**
 * @param {import('./consentModel.js').ConsentRecord|null} record
 */
export function syncConsentToDom(record) {
  if (typeof document === "undefined") return;

  if (typeof window !== "undefined") {
    window.__RS_CONSENT__ = record;
  }

  const root = document.documentElement;
  const analytics = hasConsentFor(record, "analytics") ? "1" : "0";
  const marketing = hasConsentFor(record, "marketing") ? "1" : "0";
  root.dataset.rsConsentAnalytics = analytics;
  root.dataset.rsConsentMarketing = marketing;
  root.dataset.rsConsentReady = record ? "1" : "0";

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EVENT, {
        detail: { consent: record },
      }),
    );
  }
}

export { EVENT as RS_CONSENT_CHANGE_EVENT };

/**
 * Optional hook for lazy-loading tags (e.g. analytics) outside React.
 * @param {'analytics'|'marketing'} category
 * @param {() => void} fn
 * @returns {() => void} unsubscribe
 */
export function onConsentGranted(category, fn) {
  const run = () => {
    const c =
      typeof window !== "undefined" ? window.__RS_CONSENT__ : null;
    if (hasConsentFor(c, category)) fn();
  };
  run();
  const handler = () => run();
  if (typeof window !== "undefined") {
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }
  return () => {};
}
