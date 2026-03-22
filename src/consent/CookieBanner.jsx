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
        .rs-cookie-banner-card {
          background: var(--rs-cookie-banner-bg-sm);
          box-shadow: var(--rs-cookie-banner-shadow-sm);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        @media (min-width: 851px) {
          .rs-cookie-banner-card {
            background: var(--rs-cookie-banner-bg-lg);
            box-shadow: var(--rs-cookie-banner-shadow-lg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        }
        .rs-cookie-banner-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rs-cookie-banner-icon svg {
          width: 14px;
          height: 14px;
        }
        .rs-cookie-banner-inner {
          gap: 8px;
        }
        .rs-cookie-banner-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .rs-cookie-banner-btns-pair {
          display: flex;
          flex-direction: row;
          gap: 10px;
          width: 100%;
        }
        .rs-cookie-banner-btns-pair button {
          flex: 1 1 0;
          min-width: 0;
        }
        @media (max-width: 850px) {
          .rs-cookie-banner-btns-pair button {
            min-height: 40px !important;
            padding: 9px 12px !important;
            font-size: 13px !important;
          }
          .rs-cookie-banner-btns > button {
            min-height: 46px !important;
            padding: 11px 16px !important;
            font-size: 15px !important;
          }
        }
        @media (min-width: 851px) {
          .rs-cookie-banner-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }
          .rs-cookie-banner-icon svg {
            width: 22px;
            height: 22px;
          }
          .rs-cookie-banner-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .rs-cookie-banner-header {
            width: 100%;
          }
          .rs-cookie-banner-text {
            flex: none !important;
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
      <div
        className="rs-cookie-dock-card rs-cookie-dock-animate rs-cookie-banner-card"
        style={{
          pointerEvents: "auto",
          width: "100%",
          border: `1px solid ${T.formCardBorder}`,
          borderRadius: 20,
          padding: "clamp(18px,3vw,26px)",
          ["--rs-cookie-banner-bg-sm"]: T.cookieModalPanel,
          ["--rs-cookie-banner-shadow-sm"]: T.cookieModalShadow,
          ["--rs-cookie-banner-bg-lg"]: T.formCardBg,
          ["--rs-cookie-banner-shadow-lg"]: T.formCardShadow,
        }}
      >
        <div
          className="rs-cookie-banner-inner"
          style={{
            display: "flex",
            flexDirection: "column",
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
              className="rs-cookie-banner-icon"
              style={{
                background: T.ctaDim,
                border: `1px solid ${T.ctaBorder}`,
                color: T.cta,
              }}
            >
              <Cookie size={22} strokeWidth={2} aria-hidden />
            </div>
            <p
              style={{
                fontFamily: "Inter Tight,system-ui,sans-serif",
                fontSize: 16,
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
          <div className="rs-cookie-banner-btns">
            <div className="rs-cookie-banner-btns-pair">
              <button
                type="button"
                onClick={() => rejectNonEssential("banner")}
                style={{
                  ...btnBase,
                  flex: "1 1 0",
                  minWidth: 0,
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
                  flex: "1 1 0",
                  minWidth: 0,
                  background: T.toggleBg,
                  color: T.textPrimary,
                  border: `1px solid ${T.toggleBorder}`,
                  fontWeight: 700,
                }}
              >
                Ustawienia
              </button>
            </div>
            <button
              type="button"
              onClick={() => acceptAll("banner")}
              style={{
                ...btnBase,
                width: "100%",
                flex: "none",
                minHeight: 52,
                fontSize: 16,
                fontWeight: 800,
                padding: "14px 20px",
                background: `linear-gradient(135deg,${T.cta},${T.ctaHover})`,
                color: "#fff",
                border: "none",
                boxShadow: `0 8px 28px ${T.ctaGlow}`,
              }}
            >
              Akceptuję wszystkie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
