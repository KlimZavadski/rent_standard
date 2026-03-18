/**
 * List of landing variants for A/B or multi-variant tests.
 * path — URL path, label — header text, variantId — passed to App.
 */
export const LANDING_VARIANTS = [
  { path: "/", label: "Main", variantId: "main" },
  { path: "/gpt_recommendations", label: "GPT", variantId: "gpt" },
  { path: "/text_updates", label: "V1", variantId: "v1" },
  { path: "/short", label: "S1", variantId: "s1" },
];
