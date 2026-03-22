import { onConsentGranted } from "./syncConsentToDom.js";

/**
 * Hook optional third-party scripts (analytics, marketing pixels) here.
 * Callbacks run when consent is granted and on later consent updates.
 */
export function registerOptionalConsentHooks() {
  onConsentGranted("analytics", () => {
    if (import.meta.env.DEV) {
      // Placeholder: inject analytics SDK when product adds tracking IDs
      console.info("[consent] analytics category enabled");
    }
  });
  onConsentGranted("marketing", () => {
    if (import.meta.env.DEV) {
      console.info("[consent] marketing category enabled");
    }
  });
}
