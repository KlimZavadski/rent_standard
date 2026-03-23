import { onConsentGranted, RS_CONSENT_CHANGE_EVENT } from "./syncConsentToDom.js";
import { isSmartlookEnabled, syncSmartlookWithConsent } from "./smartlook.js";

/** Re-run Smartlook (and future tags) from `window.__RS_CONSENT__`. */
export function syncOptionalScriptsWithConsent() {
  if (!isSmartlookEnabled()) return;
  syncSmartlookWithConsent();
}

/**
 * Hook optional third-party scripts (analytics, marketing pixels) here.
 * Callbacks run when consent is granted and on later consent updates.
 *
 * Smartlook: `syncSmartlookWithConsent()` in `smartlook.js` calls
 * `smartlook('init')` once, then `smartlook('pause')` / `smartlook('resume')`
 * when analytics consent is revoked / restored (via this listener + initial sync).
 */
export function registerOptionalConsentHooks() {
  if (isSmartlookEnabled()) {
    const syncSmartlook = () => syncOptionalScriptsWithConsent();
    syncSmartlook();
    if (typeof window !== "undefined") {
      window.addEventListener(RS_CONSENT_CHANGE_EVENT, syncSmartlook);
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) syncSmartlook();
      });
    }
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
