/** GPT Recommendations variant theme — purple accent + contrast/accessibility as in main recommendations */
import { DARK as BASE_DARK, LIGHT as BASE_LIGHT, mergeTheme } from "../theme.js";

const darkOverrides = {
  cta: "#A78BFA",
  ctaHover: "#8B5CF6",
  ctaGlow: "rgba(167,139,250,0.45)",
  ctaDim: "rgba(167,139,250,0.1)",
  ctaBorder: "rgba(167,139,250,0.35)",
  info: "#C4B5FD",
  textMuted: "rgba(255,255,255,0.45)",
  formPrivacy: "rgba(255,255,255,0.5)",
  inputPlaceholder: "rgba(255,255,255,0.4)",
  checkboxBorder: "rgba(255,255,255,0.25)",
  consentText: "rgba(255,255,255,0.55)",
  partnerLabel: "rgba(255,255,255,0.5)",
  partnerSub: "rgba(255,255,255,0.5)",
  footerText: "rgba(255,255,255,0.5)",
  footerLink: "rgba(255,255,255,0.55)",
  statLabelColor: "rgba(255,255,255,0.55)",
  statNote: "rgba(255,255,255,0.5)",
  badgesColor: "rgba(255,255,255,0.55)",
  tagInfoColor: "rgba(255,255,255,0.55)",
  reviewSubRole: "rgba(255,255,255,0.5)",
  meshGreen: "rgba(167,139,250,0.06)",
  meshGreenMid: "rgba(167,139,250,0.03)",
  bentoCtaBg: "linear-gradient(140deg,rgba(167,139,250,0.08),rgba(167,139,250,0.02))",
  bentoCtaBorder: "rgba(167,139,250,0.3)",
  bentoGlow: "rgba(167,139,250,0.12)",
  scrollbarThumb: "rgba(167,139,250,0.5)",
};

const lightOverrides = {
  cta: "#7C3AED",
  ctaHover: "#6D28D9",
  ctaGlow: "rgba(124,58,237,0.3)",
  ctaDim: "rgba(124,58,237,0.08)",
  ctaBorder: "rgba(124,58,237,0.3)",
  info: "#5B21B6",
  textMuted: "#64748B",
  meshGreen: "rgba(124,58,237,0.06)",
  meshGreenMid: "rgba(124,58,237,0.03)",
  scrollbarThumb: "rgba(124,58,237,0.3)",
};

export const DARK = mergeTheme(BASE_DARK, darkOverrides);
export const LIGHT = mergeTheme(BASE_LIGHT, lightOverrides);
