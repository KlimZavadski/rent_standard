import { STORAGE_KEY } from "./consentConstants.js";
import { parseConsentRecord } from "./consentModel.js";
import { syncConsentToDom } from "./syncConsentToDom.js";

/**
 * @returns {import('./consentModel.js').ConsentRecord|null}
 */
export function readConsentSync() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parseConsentRecord(parsed);
  } catch {
    return null;
  }
}

/**
 * @param {import('./consentModel.js').ConsentRecord|null} record
 */
export function writeConsentSync(record) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    if (!record) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    }
  } catch {
    /* ignore quota */
  }
  syncConsentToDom(record);
}

/** Call early from main.jsx so non-React code can read consent. */
export function hydrateConsentGlobals() {
  const c = readConsentSync();
  syncConsentToDom(c);
}
