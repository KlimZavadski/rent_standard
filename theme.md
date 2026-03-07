# Rent Standard — Theme (agent context)

Use this when styling UI or generating theme-aware code. Theme tokens live in `src/theme.js`; the app uses `useT()` for the current theme and toggles between **Light** (default) and **Dark**.

## Core palette

| Role | Light theme | Dark theme |
|------|-------------|------------|
| **Primary (CTA)** | `#0E7C66` (teal) | same |
| **CTA hover** | `#0B6653` | same |
| **Info** | `#153688` (dark blue) | `#7EB8D4` (soft blue) |
| **Warn / error** | `#DC2626` | `#E05555` |
| **Page background** | `#F8FAFC` | `#0B1F2E` |

## Text

| Role | Light theme | Dark theme |
|------|-------------|------------|
| **Primary** | `#0F172A` | `#FFFFFF` |
| **Secondary** | `#475569` | `rgba(255,255,255,0.55)` |
| **Muted** | `#94A3B8` | `rgba(255,255,255,0.3)` |

## Usage in code

- **Theme object:** `import { DARK, LIGHT, useT } from "./theme.js"` (or from `src/theme.js`).
- **Current theme:** `const T = useT();` then use `T.cta`, `T.bg`, `T.textPrimary`, etc.
- **Theme toggle:** App state `isDark`; `false` = Light (default), `true` = Dark.
- **Semantic tokens:** Prefer `T.cta`, `T.info`, `T.warn`, `T.textPrimary`, `T.textSecondary`, `T.textMuted`, `T.bg` instead of hardcoding hex values.

## File reference

- **Definitions:** `src/theme.js` — `DARK`, `LIGHT`, `palette`, `ThemeCtx`, `useT()`.
