/**
 * Shared fixed dock: bottom on mobile, bottom-right (max 400px) on desktop.
 * Used by CookieBanner and CookiePreferencesModal.
 */
export const COOKIE_DOCK_CSS = `
@keyframes rs-cookie-rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
.rs-cookie-dock-root {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: clamp(12px,3vw,20px);
  pointer-events: none;
  display: flex;
  justify-content: center;
}
.rs-cookie-dock-root.rs-cookie-prefs-dock {
  z-index: 210;
}
.rs-cookie-dock-card {
  pointer-events: auto;
  width: 100%;
  max-width: min(1100px, 100%);
  margin-left: auto;
  margin-right: auto;
}
.rs-cookie-dock-animate {
  animation: rs-cookie-rise 0.45s cubic-bezier(.4,0,.2,1) both;
}
@media (min-width: 851px) {
  .rs-cookie-dock-root {
    justify-content: flex-end;
    padding-left: clamp(16px, 3vw, 48px);
    padding-right: clamp(16px, 3vw, 48px);
  }
  .rs-cookie-dock-card {
    max-width: 400px;
    margin-left: auto;
    margin-right: 0;
  }
}
`;
