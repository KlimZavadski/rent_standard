import { hasConsentFor } from "./consentModel.js";

/**
 * `VITE_USE_GA=false` turns GA off. Unset or any other value → on (if measurement ID set).
 * @returns {boolean}
 */
export function isGoogleAnalyticsEnabled() {
  const v =
    typeof import.meta.env !== "undefined" ? import.meta.env.VITE_USE_GA : undefined;
  if (v === undefined || v === "") return true;
  return String(v).toLowerCase() !== "false";
}

const MEASUREMENT_ID =
  typeof import.meta.env !== "undefined" ? import.meta.env.VITE_GA_MEASUREMENT_ID : "";

const GTAG_SCRIPT_ATTR = "data-rs-ga-gtag";

const CONSENT_DENIED = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

const CONSENT_ANALYTICS_GRANTED = {
  ...CONSENT_DENIED,
  analytics_storage: "granted",
};

/** @type {boolean} */
let stubDone = false;
/** @type {boolean} */
let scriptInjected = false;
/** @type {boolean} */
let configDone = false;

function measurementIdTrimmed() {
  return (MEASUREMENT_ID || "").trim();
}

function gtagSrc(id) {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}

/**
 * Consent Mode defaults before gtag.js loads (no network).
 * Call once from app entry before optional script sync.
 */
export function initGtagConsentStub() {
  if (typeof window === "undefined") return;
  if (!isGoogleAnalyticsEnabled()) return;
  if (!measurementIdTrimmed()) return;
  if (stubDone) return;
  stubDone = true;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  window.gtag("consent", "default", {
    ...CONSENT_DENIED,
    wait_for_update: 500,
  });
}

/**
 * @returns {boolean}
 */
export function isGaTagReady() {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    scriptInjected &&
    configDone
  );
}

function applyConsentUpdate(state) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("consent", "update", state);
  } catch {
    /* ignore */
  }
}

/**
 * @returns {Promise<void>}
 */
function ensureGtagScript(id) {
  if (typeof document === "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[${GTAG_SCRIPT_ATTR}='1']`);
    if (existing) {
      if (existing.dataset.rsLoaded === "1") {
        scriptInjected = true;
        resolve();
      } else {
        existing.addEventListener(
          "load",
          () => {
            scriptInjected = true;
            resolve();
          },
          { once: true },
        );
      }
      return;
    }

    const s = document.createElement("script");
    s.async = true;
    s.src = gtagSrc(id);
    s.setAttribute(GTAG_SCRIPT_ATTR, "1");
    s.addEventListener(
      "load",
      () => {
        s.dataset.rsLoaded = "1";
        scriptInjected = true;
        resolve();
      },
      { once: true },
    );
    s.addEventListener(
      "error",
      () => reject(new Error("Google gtag.js failed to load")),
      { once: true },
    );
    document.head.appendChild(s);
  });
}

/**
 * Sync GA4 tag with `window.__RS_CONSENT__` (analytics category).
 */
export function syncGaWithConsent() {
  if (typeof window === "undefined") return;
  if (!isGoogleAnalyticsEnabled()) return;

  const id = measurementIdTrimmed();
  if (!id) {
    if (import.meta.env.DEV) {
      console.info("[ga4] set VITE_GA_MEASUREMENT_ID to enable Google Analytics");
    }
    return;
  }

  initGtagConsentStub();

  const granted = hasConsentFor(window.__RS_CONSENT__, "analytics");

  if (!granted) {
    if (scriptInjected) applyConsentUpdate(CONSENT_DENIED);
    return;
  }

  void ensureGtagScript(id)
    .then(() => {
      if (!hasConsentFor(window.__RS_CONSENT__, "analytics")) return;

      if (typeof window.gtag !== "function") return;

      if (!configDone) {
        window.gtag("js", new Date());
      }
      applyConsentUpdate(CONSENT_ANALYTICS_GRANTED);

      if (!configDone) {
        try {
          window.gtag("config", id, { send_page_view: true });
        } catch {
          /* ignore */
        }
        configDone = true;
      }
    })
    .catch((err) => {
      if (import.meta.env.DEV) {
        console.warn("[ga4]", err);
      }
    });
}

/**
 * Virtual page view for SPA navigations (after initial `config`).
 * Uses full `window.location` path so GitHub Pages base path is included.
 */
export function sendGaPageView() {
  if (typeof window === "undefined") return;
  if (!isGoogleAnalyticsEnabled()) return;
  const mid = measurementIdTrimmed();
  if (!mid) return;
  if (!hasConsentFor(window.__RS_CONSENT__, "analytics")) return;
  if (!isGaTagReady()) return;

  const pagePath = `${window.location.pathname}${window.location.search}`;
  try {
    window.gtag("config", mid, {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  } catch {
    /* ignore */
  }
}

/**
 * Custom GA4 event for UI clicks (buttons, links). No-op without analytics consent / ready gtag.
 * @param {{ variant_id?: string, click_type: 'button'|'link', element_text: string, link_url?: string }} payload
 */
export function trackGaUiClick(payload) {
  if (typeof window === "undefined") return;
  if (!isGoogleAnalyticsEnabled()) return;
  if (!measurementIdTrimmed()) return;
  if (!hasConsentFor(window.__RS_CONSENT__, "analytics")) return;
  if (!isGaTagReady()) return;

  const text = (payload.element_text || "").trim().replace(/\s+/g, " ").slice(0, 120);
  try {
    window.gtag("event", "rs_ui_click", {
      variant_id: payload.variant_id || "",
      click_type: payload.click_type,
      element_text: text,
      link_url: payload.link_url || "",
    });
  } catch {
    /* ignore */
  }
}
