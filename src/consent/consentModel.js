import {
  CONSENT_POLICY_VERSION,
  CONSENT_REGION,
  CONSENT_SCHEMA_VERSION,
} from "./consentConstants.js";

/**
 * @typedef {Object} ConsentCategories
 * @property {true} necessary
 * @property {boolean} analytics
 * @property {boolean} marketing
 */

/**
 * @typedef {Object} ConsentRecord
 * @property {number} schemaVersion
 * @property {number} policyVersion
 * @property {string} region
 * @property {string} timestamp
 * @property {'banner'|'preferences'|'footer'} source
 * @property {ConsentCategories} categories
 */

export function defaultCategories() {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
  };
}

/** @returns {ConsentRecord} */
export function buildConsent({ categories, source }) {
  const c = categories || defaultCategories();
  return {
    schemaVersion: CONSENT_SCHEMA_VERSION,
    policyVersion: CONSENT_POLICY_VERSION,
    region: CONSENT_REGION,
    timestamp: new Date().toISOString(),
    source,
    categories: {
      necessary: true,
      analytics: Boolean(c.analytics),
      marketing: Boolean(c.marketing),
    },
  };
}

/** @returns {ConsentRecord} */
export function acceptAllConsent(source) {
  return buildConsent({
    source,
    categories: {
      necessary: true,
      analytics: true,
      marketing: true,
    },
  });
}

/** @returns {ConsentRecord} */
export function rejectNonEssentialConsent(source) {
  return buildConsent({
    source,
    categories: defaultCategories(),
  });
}

/**
 * @param {unknown} raw
 * @returns {ConsentRecord|null}
 */
export function parseConsentRecord(raw) {
  if (!raw || typeof raw !== "object") return null;
  const o = /** @type {Record<string, unknown>} */ (raw);
  const categories = o.categories;
  if (!categories || typeof categories !== "object") return null;
  const c = /** @type {Record<string, unknown>} */ (categories);
  if (c.necessary !== true) return null;
  return {
    schemaVersion: Number(o.schemaVersion) || 0,
    policyVersion: Number(o.policyVersion) || 0,
    region: typeof o.region === "string" ? o.region : CONSENT_REGION,
    timestamp: typeof o.timestamp === "string" ? o.timestamp : new Date().toISOString(),
    source:
      o.source === "banner" || o.source === "preferences" || o.source === "footer"
        ? o.source
        : "banner",
    categories: {
      necessary: true,
      analytics: Boolean(c.analytics),
      marketing: Boolean(c.marketing),
    },
  };
}

/**
 * @param {ConsentRecord|null} record
 * @returns {boolean} true → show first-layer banner again
 */
export function shouldRepromptBanner(record) {
  if (!record) return true;
  if (record.schemaVersion !== CONSENT_SCHEMA_VERSION) return true;
  if (record.policyVersion !== CONSENT_POLICY_VERSION) return true;
  return false;
}

/**
 * @param {ConsentRecord|null} record
 * @param {import('./consentConstants.js').ConsentCategory} category
 */
export function hasConsentFor(record, category) {
  if (!record) return category === "necessary";
  if (category === "necessary") return true;
  return Boolean(record.categories[category]);
}
