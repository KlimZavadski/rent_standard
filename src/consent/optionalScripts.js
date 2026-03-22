import { onConsentGranted, RS_CONSENT_CHANGE_EVENT } from "./syncConsentToDom.js";
import { syncSmartlookWithConsent } from "./smartlook.js";

/**
 * Hook optional third-party scripts (analytics, marketing pixels) here.
 * Callbacks run when consent is granted and on later consent updates.
 *
 * Smartlook: `syncSmartlookWithConsent()` in `smartlook.js` calls
 * `smartlook('init')` once, then `smartlook('pause')` / `smartlook('resume')`
 * when analytics consent is revoked / restored (via this listener + initial sync).
 */
export function registerOptionalConsentHooks() {
  const syncSmartlook = () => syncSmartlookWithConsent();
  syncSmartlook();
  if (typeof window !== "undefined") {
    window.addEventListener(RS_CONSENT_CHANGE_EVENT, syncSmartlook);
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
