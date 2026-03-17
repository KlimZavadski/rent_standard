/**
 * List of landing variants for A/B or multi-variant tests.
 * path — URL path, label — header text, variantId — passed to App.
 */
export const LANDING_VARIANTS = [
  { path: "/", label: "Main", variantId: "main" },
  { path: "/versions/gpt_recommendations", label: "GPT", variantId: "gpt_recommendations" },
  { path: "/versions/text_updates", label: "New Texts", variantId: "text_updates" },
];
