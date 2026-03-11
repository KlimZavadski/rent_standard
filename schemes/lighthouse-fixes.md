# Lighthouse fixes — requirements, fixes, build plan

Documentation of the issues reported by Chrome Lighthouse and how they were addressed.

---

## 1. Initial requirements (Lighthouse report)

| # | Issue | Category |
|---|--------|----------|
| 1 | **Render-blocking request:** `/css2?family=Inter+Tight:wght@400;500;600;700&display=swap` blocks initial render (FCP/LCP). Defer or inline to move off critical path. | Performance |
| 2 | **Minify JavaScript** — reduce payload sizes. | Performance |
| 3 | **Reduce unused JavaScript** — defer loading until required to decrease bytes. | Performance |
| 4 | **Back/forward cache (bfcache)** — many navigations use back/forward; bfcache can speed them up. | Performance |
| 5 | **Low contrast** — background and foreground colors do not have sufficient contrast ratio (WCAG). | Accessibility |
| 6 | **Heading order** — "Ryzyko najmu w Polsce" etc. not in sequentially-descending order; headings skip levels. | Accessibility |
| 7 | **No main landmark** — document does not have a `main` landmark for screen reader navigation. | Accessibility |

---

## 2. Way of fixes

### 1. Render-blocking fonts (FCP/LCP)

- **Cause:** Synchronous `<link rel="stylesheet">` in `index.html` and duplicate dynamic `<link>` injection in `App.jsx` / `gpt_recommendations.jsx` for Google Fonts.
- **Fix:**
  - Removed blocking stylesheet from `index.html`.
  - Consolidated one URL: Inter Tight (400–900) + Manrope (400–800).
  - In `index.html`: added `rel="preload" as="style"` and a stylesheet with `media="print" onload="this.media='all'"` so it loads asynchronously.
  - Removed `document.createElement("link")` and `appendChild(link)` from `App.jsx` and `src/versions/gpt_recommendations.jsx` (fonts loaded from HTML only).

**Files:** `index.html`, `src/App.jsx`, `src/versions/gpt_recommendations.jsx`

### 2. Minify JavaScript

- **Cause:** Default Vite build uses esbuild minifier; request was to ensure minification and possibly better compression.
- **Fix:** In `vite.config.js` set `build.minify: "terser"` and `terserOptions.compress: { drop_console: true, drop_debugger: true }`. Added `terser` as devDependency.

**Files:** `vite.config.js`, `package.json`

### 3. Reduce unused JavaScript

- **Cause:** Single main chunk; no splitting.
- **Fix:** In `vite.config.js` added `rollupOptions.output.manualChunks`: `vendor` (react, react-dom), `icons` (lucide-react). Tree-shaking is handled by Rollup by default; named imports from `lucide-react` are already tree-shaken.

**Files:** `vite.config.js`

### 4. Back/forward cache (bfcache)

- **Cause:** Dynamic font `<link>` injection in `useEffect` without cleanup could affect bfcache; no `unload` handlers present.
- **Fix:** Addressed indirectly by removing dynamic font injection (fix #1). No `unload`/`beforeunload` listeners; ensure production server does not send `Cache-Control: no-store` for HTML if bfcache is desired.

**Files:** N/A (behavioral; covered by fix #1)

### 5. Low contrast (WCAG)

- **Cause:** Several theme tokens had contrast below 4.5:1 (AA).
- **Fix:** Updated `src/theme.js`:
  - **LIGHT:** `textMuted`, `formPrivacy`, `footerText`: `#94A3B8` → `#64748B`.
  - **DARK:** `textMuted` → `rgba(255,255,255,0.5)`; `consentText` → `0.6`; `formPrivacy` → `0.55`; `footerText` → `0.5`; `footerLink` → `0.55`; `statLabelColor`, `badgesColor` → `0.6`.

**Files:** `src/theme.js`

### 6. Heading order

- **Cause:** After `<h1>` (hero) came `<h3>` in the pain block ("Ryzyko najmu w Polsce", "Sąd vs. Mediacja") — no `<h2>` for that section.
- **Fix:** Added a section heading in the pain block: tag "Skala problemu" + `<h2 id="pain-heading">Dlaczego musisz się zabezpieczyć</h2>`. Section got `aria-labelledby="pain-heading"`. Card titles remain `<h3>` under this `<h2>`. Same change in `App.jsx` and `src/versions/gpt_recommendations.jsx`.

**Files:** `src/App.jsx`, `src/versions/gpt_recommendations.jsx`

### 7. Main landmark

- **Cause:** All content was in generic `<div>`; no `<main>` for assistive tech.
- **Fix:** Wrapped content between `</nav>` and `<footer>` in `<main>` (with existing styles, e.g. `overflowX: "hidden"`). Applied in `App.jsx` and `src/versions/gpt_recommendations.jsx` (there: `<main className="main-content" ...>`).

**Files:** `src/App.jsx`, `src/versions/gpt_recommendations.jsx`

---

## 3. Build plan (order of work)

1. **Main landmark** — Replace wrapper `<div>` with `<main>` in `App.jsx` and `gpt_recommendations.jsx`.
2. **Heading hierarchy** — Add `<h2>` (and optional tag) to pain section in both app files.
3. **Render-blocking fonts** — Consolidate fonts in `index.html` (async load), remove dynamic `<link>` from app and version file.
4. **Contrast** — Update LIGHT/DARK tokens in `theme.js` to meet WCAG AA.
5. **Vite: minify + chunks** — Set `minify: "terser"`, `terserOptions`, `manualChunks` in `vite.config.js`; add `terser` to devDependencies.
6. **Smoke test** — Run `./automation/build.sh`, then serve `dist` and run Playwright tests (`./automation/run-playwrite-tests.sh`).

---

## 4. Verification

- **Build:** `./automation/build.sh` — produces minified chunks (`vendor`, `icons`, `index`) in `dist/`.
- **Lighthouse:** Re-run Performance and Accessibility audits; render-blocking, contrast, headings, and main landmark should pass or improve.
- **Playwright:** `npx playwright install` then `./automation/run-playwrite-tests.sh` (requires browsers installed).
