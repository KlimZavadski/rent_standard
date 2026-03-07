This project is a landing page for a real estate agency.

It is a simple landing page with a header, a main section, and a footer.

The main section is a grid of cards with the following information:
- The name of the agency
- The address of the agency
- The phone number of the agency
- The email of the agency
- The website of the agency
- The social media links of the agency

## Technologies
- HTML
- CSS
- JavaScript

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
- **GitHub Pages**: workflow `.github/workflows/deploy-pages.yml` builds the project and deploys the `dist/` output to GitHub Pages (typically on push to the default branch or on release).

## Instructions
- use playwrite MCP to launch and check the landing page