import { Cookie } from "lucide-react";
import { useT } from "../theme.js";
import { COOKIE_DOCK_CSS } from "./cookieDockSharedCss.js";
import { useCookieConsent } from "./CookieConsentContext.jsx";

export function CookieBanner() {
  const T = useT();
  const { bannerOpen, preferencesOpen, openPreferences, acceptAll, rejectNonEssential } =
    useCookieConsent();

  if (!bannerOpen || preferencesOpen) return null;

  const btnBase = {
    fontFamily: "Manrope,system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 44,
    flex: "1 1 160px",
  };

  return (
    <div
      role="region"
      aria-label="Zgoda na pliki cookie"
      className="rs-cookie-dock-root"
    >
      <style>{COOKIE_DOCK_CSS}</style>
      <style>{`
        @media (min-width: 851px) {
          .rs-cookie-banner-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .rs-cookie-banner-header {
            width: 100%;
          }
          .rs-cookie-banner-text {
            flex: none !important;
            width: 100%;
            max-width: none;
          }
          .rs-cookie-banner-btns {
            flex-direction: column;
            flex: none !important;
            width: 100%;
            justify-content: stretch;
          }
          .rs-cookie-banner-btns button {
            width: 100%;
            flex: none !important;
          }
        }
      `}</style>
      <div
        className="rs-cookie-dock-card rs-cookie-dock-animate"
        style={{
          pointerEvents: "auto",
          width: "100%",
          background: T.formCardBg,
          border: `1px solid ${T.formCardBorder}`,
          borderRadius: 20,
          padding: "clamp(18px,3vw,26px)",
          boxShadow: T.formCardShadow,
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="rs-cookie-banner-inner"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <div
            className="rs-cookie-banner-header"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              minWidth: 0,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: 12,
                background: T.ctaDim,
                border: `1px solid ${T.ctaBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.cta,
              }}
            >
              <Cookie size={22} strokeWidth={2} aria-hidden />
            </div>
            <p
              style={{
                fontFamily: "Inter Tight,system-ui,sans-serif",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: T.textPrimary,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Szanujemy Twoją prywatność
            </p>
          </div>
          <div className="rs-cookie-banner-text" style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: T.textSecondary,
                margin: 0,
              }}
            >
              Niezbędne cookie zapewniają działanie strony; za zgodą — analitykę i marketing.{" "}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: T.info, fontWeight: 600 }}
              >
                Polityka plików cookie
              </a>
            </p>
          </div>
          <div
            className="rs-cookie-banner-btns"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "stretch",
              width: "100%",
            }}
          >
            <button
              type="button"
              onClick={() => acceptAll("banner")}
              style={{
                ...btnBase,
                background: `linear-gradient(135deg,${T.cta},${T.ctaHover})`,
                color: "#fff",
                border: "none",
                boxShadow: `0 8px 28px ${T.ctaGlow}`,
                fontWeight: 800,
              }}
            >
              Akceptuję wszystkie
            </button>
            <button
              type="button"
              onClick={() => rejectNonEssential("banner")}
              style={{
                ...btnBase,
                background: "transparent",
                color: T.textPrimary,
                border: `1px solid ${T.secBtnBorder}`,
                fontWeight: 700,
              }}
            >
              Odrzuć opcjonalne
            </button>
            <button
              type="button"
              onClick={() => openPreferences()}
              style={{
                ...btnBase,
                background: T.toggleBg,
                color: T.textPrimary,
                border: `1px solid ${T.toggleBorder}`,
                fontWeight: 700,
              }}
            >
              Ustawienia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
