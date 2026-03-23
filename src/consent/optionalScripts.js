import { onConsentGranted, RS_CONSENT_CHANGE_EVENT } from "./syncConsentToDom.js";
import { isGoogleAnalyticsEnabled, syncGaWithConsent } from "./googleAnalytics.js";
import { isSmartlookEnabled, syncSmartlookWithConsent } from "./smartlook.js";

/** Re-run Smartlook and GA4 from `window.__RS_CONSENT__`. */
export function syncOptionalScriptsWithConsent() {
  if (isSmartlookEnabled()) syncSmartlookWithConsent();
  if (isGoogleAnalyticsEnabled()) syncGaWithConsent();
}

/**
 * Hook optional third-party scripts (analytics, marketing pixels) here.
 * Callbacks run when consent is granted and on later consent updates.
 *
 * Smartlook: `syncSmartlookWithConsent()` in `smartlook.js` calls
 * `smartlook('init')` once, then `smartlook('pause')` / `smartlook('resume')`
 * when analytics consent is revoked / restored (via this listener + initial sync).
 *
 * GA4: `syncGaWithConsent()` in `googleAnalytics.js` loads gtag.js after analytics
 * consent and updates Consent Mode on revoke / restore.
 */
export function registerOptionalConsentHooks() {
  const syncAll = () => syncOptionalScriptsWithConsent();
  syncAll();
  if (typeof window !== "undefined") {
    window.addEventListener(RS_CONSENT_CHANGE_EVENT, syncAll);
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) syncAll();
    });
  }

  onConsentGranted("analytics", () => {
    if (import.meta.env.DEV) {
      console.info("[consent] analytics category enabled");
    }
  });
  onConsentGranted("marketing", () => {
    if (import.meta.env.DEV) {
      console.info("[consent] marketing category enabled");
    }
  });
}
