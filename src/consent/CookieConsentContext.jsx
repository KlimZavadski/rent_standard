import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  acceptAllConsent,
  buildConsent,
  rejectNonEssentialConsent,
  shouldRepromptBanner,
} from "./consentModel.js";
import { readConsentSync, writeConsentSync } from "./consentStorage.js";
import { STORAGE_KEY } from "./consentConstants.js";
import { syncConsentToDom } from "./syncConsentToDom.js";
import { syncOptionalScriptsWithConsent } from "./optionalScripts.js";

const Ctx = createContext(null);

export function CookieConsentProvider({ children }) {
  const [consent, setConsent] = useState(() => readConsentSync());
  const [bannerOpen, setBannerOpen] = useState(() =>
    shouldRepromptBanner(readConsentSync()),
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    syncConsentToDom(consent);
    syncOptionalScriptsWithConsent();
  }, [consent]);

  const persist = useCallback((next) => {
    writeConsentSync(next);
    setConsent(next);
    setBannerOpen(shouldRepromptBanner(next));
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const next = readConsentSync();
      setConsent(next);
      setBannerOpen(shouldRepromptBanner(next));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const acceptAll = useCallback(
    (source) => {
      persist(acceptAllConsent(source));
      setPreferencesOpen(false);
    },
    [persist],
  );

  const rejectNonEssential = useCallback(
    (source) => {
      if (import.meta.env.DEV) {
        console.info("[consent] optional categories rejected");
      }
      persist(rejectNonEssentialConsent(source));
      setPreferencesOpen(false);
    },
    [persist],
  );

  const savePreferences = useCallback(
    (categories, source) => {
      persist(buildConsent({ source, categories }));
      setPreferencesOpen(false);
    },
    [persist],
  );

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      bannerOpen,
      preferencesOpen,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [
      consent,
      bannerOpen,
      preferencesOpen,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      closePreferences,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider
export function useCookieConsent() {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return v;
}
