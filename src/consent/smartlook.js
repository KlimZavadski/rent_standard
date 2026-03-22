import { hasConsentFor } from "./consentModel.js";

const KEY =
  typeof import.meta.env !== "undefined"
    ? import.meta.env.VITE_SMARTLOOK_KEY
    : "";
const REGION =
  typeof import.meta.env !== "undefined"
    ? import.meta.env.VITE_SMARTLOOK_REGION
    : "";

const RECORDER_SRC = "https://web-sdk.smartlook.com/recorder.js";

/** @type {boolean} */
let initDone = false;

function regionOpts() {
  if (REGION === "eu" || REGION === "us") return { region: REGION };
  return {};
}

/**
 * @returns {Promise<void>}
 */
function ensureStubAndRecorder() {
  if (typeof document === "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      "script[data-rs-smartlook-recorder='1']",
    );
    if (existing) {
      if (existing.dataset.rsLoaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    window.smartlook ||
      (function (d) {
        const o = (window.smartlook = function () {
          o.api.push(arguments);
        });
        const h = d.getElementsByTagName("head")[0];
        const c = d.createElement("script");
        o.api = [];
        c.async = true;
        c.type = "text/javascript";
        c.charset = "utf-8";
        c.src = RECORDER_SRC;
        c.dataset.rsSmartlookRecorder = "1";
        c.addEventListener(
          "load",
          () => {
            c.dataset.rsLoaded = "1";
            resolve();
          },
          { once: true },
        );
        c.addEventListener(
          "error",
          () => reject(new Error("Smartlook recorder failed to load")),
          { once: true },
        );
        h.appendChild(c);
      })(document);
  });
}

function pause() {
  try {
    if (typeof window !== "undefined" && window.smartlook) {
      window.smartlook("pause");
    }
  } catch {
    /* ignore */
  }
}

function resume() {
  try {
    if (typeof window !== "undefined" && window.smartlook) {
      window.smartlook("resume");
    }
  } catch {
    /* ignore */
  }
}

/**
 * Start / pause Smartlook from current `window.__RS_CONSENT__` (analytics).
 */
export function syncSmartlookWithConsent() {
  if (typeof window === "undefined") return;

  if (!KEY?.trim()) {
    if (import.meta.env.DEV) {
      console.info("[smartlook] set VITE_SMARTLOOK_KEY to enable recording");
    }
    return;
  }

  const granted = hasConsentFor(window.__RS_CONSENT__, "analytics");

  if (!granted) {
    if (initDone) pause();
    return;
  }

  if (initDone) {
    resume();
    return;
  }

  void ensureStubAndRecorder()
    .then(() => {
      if (!hasConsentFor(window.__RS_CONSENT__, "analytics")) return;
      const opts = regionOpts();
      const args =
        Object.keys(opts).length > 0 ? [KEY.trim(), opts] : [KEY.trim()];
      window.smartlook("init", ...args);
      initDone = true;
    })
    .catch((err) => {
      if (import.meta.env.DEV) {
        console.warn("[smartlook]", err);
      }
    });
}
