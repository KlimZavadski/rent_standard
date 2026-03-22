import { useT } from "../theme.js";
import { useCookieConsent } from "./CookieConsentContext.jsx";

export function CookieFooterButton({ style: userStyle = {} }) {
  const T = useT();
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={() => openPreferences()}
      style={{
        color: T.footerLink,
        fontSize: 13,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textDecoration: "underline",
        textUnderlineOffset: 3,
        fontFamily: "inherit",
        ...userStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = T.cta;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = T.footerLink;
      }}
    >
      Ustawienia plików cookie
    </button>
  );
}
