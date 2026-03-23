/**
 * Registration of landing variant themes.
 * Theme file: src/themes/{variantId}.js, export: { DARK, LIGHT }.
 * To add a variant: 1) create themes/{variantId}.js, 2) add import and register below.
 */
import { registerVariantTheme } from "../theme.js";

import * as mainTheme from "./main.js";
import * as gpt_recommendationsTheme from "./gpt_recommendations.js";

registerVariantTheme("main", mainTheme);
registerVariantTheme("gpt_colors", gpt_recommendationsTheme);
