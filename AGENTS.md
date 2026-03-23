This project is a landing page for a real estate agency.

It is a simple landing page with a header, a main section, and a footer.

The main section is a grid of cards with the following information:
- The name of the agency
- The address of the agency
- The phone number of the agency
- The email of the agency
- The website of the agency
- The social media links of the agency

## Project structure
- **`src/`** — React app: `main.jsx` (entry, mounts app), `App.jsx` (main landing page component).
- **`src/versions/`** — alternative landing variants (A/B tests). Each React component here corresponds to a variant registered in `landingVariants.js` and rendered via `main.jsx` routing.
- **`index.html`** — Vite entry; script points to `/src/main.jsx`.
- **`schemes/`** — Feature schemes in Mermaid: when planning a feature, the agent adds a scheme file here and draws the diagram using Mermaid.
- **`tests/`** — Playwright smoke tests.
- **`automation/`** — Shell scripts for build and local run.

## Themes
- **Base themes** live in `src/theme.js` (`DARK`, `LIGHT`). Variant themes are in `src/themes/{variantId}.js` and are **merged on top of the base**: each variant exports partial `{ DARK, LIGHT }` overrides that are shallow-merged with the base theme via `mergeTheme(base, overrides)`.
- **Registration:** `src/themes/index.js` imports each variant theme and calls `registerVariantTheme(variantId, { DARK, LIGHT })`. To add a variant: create `src/themes/{variantId}.js` (export `DARK` and/or `LIGHT` overrides), then add the import and `registerVariantTheme` call in `themes/index.js`.
- **Resolution:** `getThemesForVariant(variantId)` returns the registered theme for that variant, or falls back to `main`, then to the base `DARK`/`LIGHT` from `theme.js`. When changing or adding theme keys, only override what differs in variant files; the rest is inherited from the base.

## Technologies
- HTML
- CSS
- JavaScript
- React (Vite)

## Features
- The landing page is responsive and works on all devices
- The landing page is SEO friendly
- The landing page is fast and lightweight
- The landing page is easy to maintain
- The landing page is easy to deploy

## Automation
In the `automation/` folder:
- **`build.sh`** — builds the project (installs dependencies if needed, runs Vite build). Output in `dist/`.
- **`run-local.sh`** — runs the dev server and opens the page in the browser (installs dependencies if needed).

Run from repo root: `./automation/build.sh`, `./automation/run-local.sh`.

## Deployment
- **GitHub Pages**: workflow `.github/workflows/deploy-pages.yml` builds the project with `--base=/<repo>/` and deploys the `dist/` output to GitHub Pages (typically on push to the default branch or on `workflow_dispatch`). The workflow sets `VITE_PUBLIC_SITE_ORIGIN` to the Pages URL so Open Graph / Twitter meta match that host.
- **Vercel**: connect the repo; framework **Vite**, build `npm run build`, output `dist`. **`vercel.json`** adds SPA rewrites so client routes work at the domain root (no repo subpath). In the Vercel project, set **`VITE_PUBLIC_SITE_ORIGIN`** to your production origin (e.g. `https://<project>.vercel.app` or your custom domain, no trailing slash) so social meta point at Vercel. Reuse the same **`VITE_*`** secrets as in GitHub Actions where applicable.
- **Both hosts**: Pages uses a subpath base URL; Vercel uses `/`. Each platform runs its own build with the correct `base` and `VITE_PUBLIC_SITE_ORIGIN`; no shared artifact is required.

## Instructions
- **AGENTS.md is always written in English.** Keep all content and any new sections in English.
- When working on UI (layout, styles, components, visual design): **use the frontend-design skill** at `.cursor/skills/frontend-design/SKILL.md`.
- After implementing a feature or making changes to the landing/UI: run the project build via automation, e.g. `./automation/build.sh`.
- Use Playwright MCP to launch and check the landing page when needed.
- **Feature planning:** When planning a feature or creating a plan, the agent must add the feature scheme to the **`schemes/`** folder and draw it using **Mermaid** (a `.md` file with a fenced `mermaid` code block). Name the file after the feature, e.g. `schemes/contact-form-flow.md`. After implementing a large feature, always run the Playwright tests and fix any failures before considering the task done.