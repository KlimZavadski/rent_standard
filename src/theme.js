import { createContext, useContext } from "react";

/**
 * Rent Standard color scheme
 *
 * Core palette:
 * - Primary (CTA): teal #0E7C66, hover #0B6653
 * - Info: dark blue #153688 (light) / soft blue #7EB8D4 (dark)
 * - Warn: red #DC2626 (light) / #E05555 (dark)
 * - Dark bg: #0B1F2E
 * - Light bg: #F8FAFC
 * - Text dark: #0F172A (primary), #475569 (secondary), #94A3B8 (muted)
 * - Text light: #FFFFFF (primary), rgba(255,255,255,0.55) (secondary), 0.3 (muted)
 */

export const DARK = {
  bg: "#0B1F2E",
  cta: "#0E7C66",
  ctaHover: "#0B6653",
  ctaGlow: "rgba(14,124,102,0.35)",
  ctaDim: "rgba(14,124,102,0.08)",
  ctaBorder: "rgba(14,124,102,0.22)",
  info: "#8EC5E2",
  infoBg: "rgba(142,197,226,0.07)",
  infoBorder: "rgba(142,197,226,0.18)",
  warn: "#E05555",
  warnBg: "rgba(224,85,85,0.08)",
  warnBorder: "rgba(224,85,85,0.2)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.3)",
  cardBg: "rgba(255,255,255,0.10)",
  cardBorder: "rgba(255,255,255,0.14)",
  cardShadow: "0 24px 64px rgba(0,0,0,0.4)",
  cardIconBg: "rgba(255,255,255,0.07)",
  cardLineColor: "rgba(255,255,255,0.4)",
  cardLineHi: "rgba(255,255,255,0.85)",
  cardLine: "rgba(255,255,255,0.06)",
  sigRgbGreen: "14,124,102",
  sigRgbBlue: "77,163,255",
  cardInfoColor: "#7EB8D4",
  navBg: "rgba(11,31,46,0.94)",
  surfBorder: "rgba(255,255,255,0.07)",
  bentoCtaBg: "linear-gradient(140deg,rgba(14,124,102,0.06),rgba(14,124,102,0.01))",
  bentoCtaBorder: "rgba(14,124,102,0.18)",
  bentoInfoBg: "rgba(255,255,255,0.025)",
  bentoInfoBorder: "rgba(255,255,255,0.08)",
  bentoNoneBg: "rgba(255,255,255,0.02)",
  bentoNoneBorder: "rgba(255,255,255,0.06)",
  bentoGlow: "rgba(14,124,102,0.08)",
  factRowBg: "rgba(255,255,255,0.025)",
  factRowBorder: "rgba(255,255,255,0.05)",
  tableOuterBg: "rgba(255,255,255,0.025)",
  tableOuterBorder: "rgba(255,255,255,0.08)",
  tableHeadBg: "rgba(255,255,255,0.04)",
  tableHeadBorder: "rgba(255,255,255,0.07)",
  tableRowAlt: "rgba(255,255,255,0.015)",
  tableRowBorder: "rgba(255,255,255,0.05)",
  tableAspect: "rgba(255,255,255,0.65)",
  tableBadBg: "rgba(255,255,255,0.03)",
  tableBadColor: "rgba(255,255,255,0.68)",
  tableBadIcon: "rgba(255,255,255,0.55)",
  formCardBg: "linear-gradient(135deg,rgba(14,124,102,0.16),rgba(126,184,212,0.18))",
  formCardBorder: "rgba(255,255,255,0.32)",
  formCardShadow: "0 0 40px rgba(255,255,255,0.08), 0 0 80px rgba(14,124,102,0.25), 0 32px 80px rgba(0,0,0,0.5)",
  formIconBg: "rgba(126,184,212,0.07)",
  formIconBorder: "rgba(126,184,212,0.18)",
  formPrivacy: "rgba(255,255,255,0.25)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.1)",
  inputFocusBg: "rgba(126,184,212,0.05)",
  inputColor: "#fff",
  inputPlaceholder: "rgba(255,255,255,0.25)",
  checkboxBorder: "rgba(255,255,255,0.18)",
  consentText: "rgba(255,255,255,0.4)",
  partnerBg: "rgba(255,255,255,0.015)",
  partnerBorder: "rgba(255,255,255,0.06)",
  partnerLabel: "rgba(255,255,255,0.25)",
  partnerSub: "rgba(255,255,255,0.3)",
  meshGreen: "rgba(14,124,102,0.05)",
  meshBlue: "rgba(126,184,212,0.06)",
  meshGreenMid: "rgba(14,124,102,0.03)",
  footerBorder: "rgba(255,255,255,0.05)",
  footerText: "rgba(255,255,255,0.2)",
  footerLink: "rgba(255,255,255,0.3)",
  secBtnColor: "rgba(255,255,255,0.65)",
  secBtnBorder: "rgba(255,255,255,0.18)",
  badgesColor: "rgba(255,255,255,0.4)",
  tagInfoColor: "rgba(255,255,255,0.5)",
  tagInfoBg: "rgba(255,255,255,0.04)",
  tagInfoBorder: "rgba(255,255,255,0.12)",
  statLabelColor: "rgba(255,255,255,0.4)",
  reviewQuote: "rgba(255,255,255,0.68)",
  reviewSubRole: "rgba(255,255,255,0.35)",
  barBg: "rgba(255,255,255,0.07)",
  barBadBg: "linear-gradient(90deg,#334155,#475569)",
  statNote: "rgba(255,255,255,0.35)",
  pillarDesc: "rgba(255,255,255,0.5)",
  pillarFeat: "rgba(255,255,255,0.6)",
  finalSubtext: "rgba(255,255,255,0.45)",
  scrollbarTrack: "#0B1F2E",
  scrollbarThumb: "rgba(14,124,102,0.4)",
  toggleBg: "rgba(255,255,255,0.07)",
  toggleBorder: "rgba(255,255,255,0.14)",
  cardOuterBorder: "rgba(255,255,255,0.06)",
  cardOuterBg: "rgba(255,255,255,0.02)",
};

export const LIGHT = {
  bg: "#F8FAFC",
  cta: "#0E7C66",
  ctaHover: "#0B6653",
  ctaGlow: "rgba(14,124,102,0.3)",
  ctaDim: "rgba(14,124,102,0.08)",
  ctaBorder: "rgba(14,124,102,0.3)",
  info: "#153688",
  infoBg: "rgba(21,54,136,0.06)",
  infoBorder: "rgba(21,54,136,0.2)",
  warn: "#DC2626",
  warnBg: "rgba(220,38,38,0.06)",
  warnBorder: "rgba(220,38,38,0.18)",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  cardBg: "rgb(54,78,150)",
  cardBorder: "rgba(255,255,255,0.12)",
  cardShadow: "0 24px 64px rgba(21,54,136,0.35)",
  cardIconBg: "rgba(255,255,255,0.12)",
  cardLineColor: "rgba(255,255,255,0.55)",
  cardLineHi: "#FFFFFF",
  cardLine: "rgba(255,255,255,0.1)",
  sigRgbGreen: "14,124,102",
  sigRgbBlue: "126,184,212",
  cardInfoColor: "#A8D4E6",
  navBg: "rgba(248,250,252,0.95)",
  surfBorder: "rgba(21,54,136,0.1)",
  bentoCtaBg: "linear-gradient(140deg,rgba(14,124,102,0.07),rgba(14,124,102,0.02))",
  bentoCtaBorder: "rgba(14,124,102,0.25)",
  bentoInfoBg: "rgba(21,54,136,0.03)",
  bentoInfoBorder: "rgba(21,54,136,0.12)",
  bentoNoneBg: "#FFFFFF",
  bentoNoneBorder: "rgba(21,54,136,0.1)",
  bentoGlow: "rgba(14,124,102,0.12)",
  factRowBg: "rgba(21,54,136,0.03)",
  factRowBorder: "rgba(21,54,136,0.08)",
  tableOuterBg: "#FFFFFF",
  tableOuterBorder: "rgba(21,54,136,0.12)",
  tableHeadBg: "rgba(21,54,136,0.04)",
  tableHeadBorder: "rgba(21,54,136,0.1)",
  tableRowAlt: "rgba(21,54,136,0.02)",
  tableRowBorder: "rgba(21,54,136,0.06)",
  tableAspect: "#334155",
  tableBadBg: "rgba(100,116,139,0.06)",
  tableBadColor: "#64748B",
  tableBadIcon: "#94A3B8",
  formCardBg: "linear-gradient(135deg,rgba(14,124,102,0.09),rgba(21,54,136,0.06))",
  formCardBorder: "rgba(14,124,102,0.45)",
  formCardShadow: "0 0 60px rgba(14,124,102,0.08), 0 32px 80px rgba(21,54,136,0.12)",
  formIconBg: "rgba(21,54,136,0.06)",
  formIconBorder: "rgba(21,54,136,0.18)",
  formPrivacy: "#94A3B8",
  inputBg: "#FFFFFF",
  inputBorder: "rgba(21,54,136,0.18)",
  inputFocusBg: "rgba(21,54,136,0.02)",
  inputColor: "#0F172A",
  inputPlaceholder: "#94A3B8",
  checkboxBorder: "rgba(21,54,136,0.25)",
  consentText: "#64748B",
  partnerBg: "rgba(21,54,136,0.02)",
  partnerBorder: "rgba(21,54,136,0.1)",
  partnerLabel: "#94A3B8",
  partnerSub: "#94A3B8",
  meshGreen: "rgba(14,124,102,0.06)",
  meshBlue: "rgba(21,54,136,0.04)",
  meshGreenMid: "rgba(14,124,102,0.03)",
  footerBorder: "rgba(21,54,136,0.1)",
  footerText: "#94A3B8",
  footerLink: "#64748B",
  secBtnColor: "#153688",
  secBtnBorder: "rgba(21,54,136,0.25)",
  badgesColor: "#64748B",
  tagInfoColor: "#153688",
  tagInfoBg: "rgba(21,54,136,0.05)",
  tagInfoBorder: "rgba(21,54,136,0.18)",
  statLabelColor: "#64748B",
  reviewQuote: "#334155",
  reviewSubRole: "#94A3B8",
  barBg: "rgba(21,54,136,0.08)",
  barBadBg: "linear-gradient(90deg,#94A3B8,#CBD5E1)",
  statNote: "#94A3B8",
  pillarDesc: "#475569",
  pillarFeat: "#334155",
  finalSubtext: "#64748B",
  scrollbarTrack: "#F8FAFC",
  scrollbarThumb: "rgba(14,124,102,0.3)",
  toggleBg: "rgba(21,54,136,0.08)",
  toggleBorder: "rgba(21,54,136,0.18)",
  cardOuterBorder: "rgb(29,59,136)",
  cardOuterBg: "rgb(31,58,137)",
};

/** Core brand palette (theme-agnostic) */
export const palette = {
  cta: "#0E7C66",
  ctaHover: "#0B6653",
  infoDark: "#153688",
  infoLight: "#7EB8D4",
  warnDark: "#DC2626",
  warnLight: "#E05555",
  bgDark: "#0B1F2E",
  bgLight: "#F8FAFC",
  textDark: { primary: "#0F172A", secondary: "#475569", muted: "#94A3B8" },
  textLight: { primary: "#FFFFFF", secondary: "rgba(255,255,255,0.55)", muted: "rgba(255,255,255,0.3)" },
};

/** Merge overrides on top of the base theme */
function mergeTheme(base, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return base;
  return { ...base, ...overrides };
}

const variantThemes = {};

/**
 * Themes (DARK/LIGHT) for a variant. Sources: files in src/themes/{variantId}.js.
 * Fallback: variant not found → main → base theme from theme.js.
 */
export function getThemesForVariant(variantId) {
  if (variantThemes[variantId]) return variantThemes[variantId];
  if (variantThemes.main) return variantThemes.main;
  return { DARK, LIGHT };
}

/**
 * Registers a variant theme (called from src/themes/index.js).
 * overrides — partial DARK/LIGHT objects, merged on top of the base theme.
 */
export function registerVariantTheme(variantId, { DARK: darkOverrides, LIGHT: lightOverrides }) {
  variantThemes[variantId] = {
    DARK: mergeTheme(DARK, darkOverrides),
    LIGHT: mergeTheme(LIGHT, lightOverrides),
  };
}

/** For theme files: merge on top of base (e.g. mergeTheme(DARK, { cta: "#..." })) */
export { mergeTheme };

export const ThemeCtx = createContext(LIGHT);
export const useT = () => useContext(ThemeCtx);
