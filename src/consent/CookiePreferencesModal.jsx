import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useT } from "../theme.js";
import { defaultCategories } from "./consentModel.js";
import { useCookieConsent } from "./CookieConsentContext.jsx";

const LABELS = [
  {
    key: "analytics",
    title: "Analityka",
    desc: "Pomiar ruchu i jakości usług (np. zdarzenia, błędy) — ułatwia rozwój produktu.",
  },
  {
    key: "marketing",
    title: "Marketing",
    desc: "Personalizacja treści i pomiar skuteczności kampanii.",
  },
];

function Toggle({ on, disabled, onToggle, label }) {
  const T = useT();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onToggle}
      style={{
        width: 48,
        height: 28,
        borderRadius: 99,
        border: `1px solid ${on ? T.cta : T.toggleBorder}`,
        background: on
          ? `linear-gradient(135deg,${T.cta},${T.ctaHover})`
          : T.toggleBg,
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        transition: "background 0.2s, border-color 0.2s",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 24 : 4,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.2s cubic-bezier(.4,0,.2,1)",
        }}
      />
      <span className="visually-hidden">{label}</span>
      <style>{`
        .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;}
      `}</style>
    </button>
  );
}

export function CookiePreferencesModal() {
  const T = useT();
  const {
    preferencesOpen,
    closePreferences,
    consent,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useCookieConsent();

  const [cat, setCat] = useState(() => defaultCategories());
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!preferencesOpen) return;
    setCat(consent?.categories ?? defaultCategories());
  }, [preferencesOpen, consent]);

  useEffect(() => {
    if (!preferencesOpen) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [preferencesOpen]);

  useEffect(() => {
    if (!preferencesOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closePreferences();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preferencesOpen, closePreferences]);

  if (!preferencesOpen) return null;

  const setKey = (key, v) => {
    setCat((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: T.cookieModalOverlay,
        backdropFilter: "blur(8px)",
      }}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closePreferences();
      }}
    >
      <div
        className="rs-cookie-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rs-cookie-modal-title"
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "min(90vh, 720px)",
          overflow: "auto",
          background: T.cookieModalPanel,
          border: `1px solid ${T.formCardBorder}`,
          borderRadius: 24,
          boxShadow: T.cookieModalShadow,
          padding: "clamp(20px,4vw,32px)",
          animation: "rs-modal-in 0.35s cubic-bezier(.4,0,.2,1) both",
        }}
      >
        <style>{`
          @keyframes rs-modal-in {
            from { opacity: 0; transform: scale(0.97) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .rs-cookie-modal-panel {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .rs-cookie-modal-panel::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <h2
            id="rs-cookie-modal-title"
            style={{
              fontFamily: "Inter Tight,system-ui,sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: T.textPrimary,
              margin: 0,
            }}
          >
            Ustawienia plików cookie
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closePreferences}
            aria-label="Zamknij"
            style={{
              background: T.cookieModalMutedBtn,
              border: `1px solid ${T.toggleBorder}`,
              borderRadius: 10,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.textSecondary,
              flexShrink: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.55, color: T.textSecondary, marginBottom: 22 }}>
          Niezbędne pliki cookie są zawsze aktywne — zapewniają podstawowe działanie i
          bezpieczeństwo. Pozostałe kategorie włączysz dobrowolnie.
        </p>

        <div
          style={{
            background: T.cookieModalRow,
            border: `1px solid ${T.cookieModalRowBorder}`,
            borderRadius: 16,
            padding: "16px 18px",
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 15 }}>
              Niezbędne
            </div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
              Działanie strony, bezpieczeństwo, podstawowe sesje.
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: T.cta,
              whiteSpace: "nowrap",
            }}
          >
            Zawsze włączone
          </span>
        </div>

        {LABELS.map(({ key, title, desc }) => (
          <div
            key={key}
            style={{
              background: T.cookieModalRow,
              border: `1px solid ${T.cookieModalRowBorder}`,
              borderRadius: 16,
              padding: "16px 18px",
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 15 }}>
                {title}
              </div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4, lineHeight: 1.45 }}>
                {desc}
              </div>
            </div>
            <Toggle
              label={title}
              on={Boolean(cat[key])}
              onToggle={() => setKey(key, !cat[key])}
            />
          </div>
        ))}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 24,
            justifyContent: "stretch",
          }}
        >
          <button
            type="button"
            onClick={() => rejectNonEssential("preferences")}
            style={{
              flex: "1 1 140px",
              minHeight: 44,
              borderRadius: 12,
              border: `1px solid ${T.secBtnBorder}`,
              background: T.cookieModalMutedBtn,
              color: T.textPrimary,
              fontFamily: "Manrope,system-ui,sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Odrzuć opcjonalne
          </button>
          <button
            type="button"
            onClick={() => savePreferences(cat, "preferences")}
            style={{
              flex: "1 1 140px",
              minHeight: 44,
              borderRadius: 12,
              border: `1px solid ${T.toggleBorder}`,
              background: T.cookieModalMutedBtn,
              color: T.textPrimary,
              fontFamily: "Manrope,system-ui,sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Zapisz wybór
          </button>
          <button
            type="button"
            onClick={() => acceptAll("preferences")}
            style={{
              flex: "1 1 200px",
              minHeight: 44,
              borderRadius: 12,
              border: "none",
              background: `linear-gradient(135deg,${T.cta},${T.ctaHover})`,
              color: "#fff",
              fontFamily: "Manrope,system-ui,sans-serif",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: `0 8px 24px ${T.ctaGlow}`,
            }}
          >
            Akceptuję wszystkie
          </button>
        </div>
      </div>
    </div>
  );
}
