# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Wiki

For a dense map of this repo (directory ToC, convention/gotcha registry, file/test/fixture matrix) and 4 domain pages on routing/animation, the feature-page pattern (and its real deviations), shared infrastructure, and testing, start at **[docs/wiki/index.md](./docs/wiki/index.md)**. It is anchored to git SHAs and checked for staleness by `node docs/wiki/lint/lint.js` (see [docs/wiki/lint/README.md](./docs/wiki/lint/README.md)) — if that command reports `STALE` pages, treat their claims as unverified until re-checked against current code.

## Toolchain

Node 10 required (see `.nvmrc`) — node-sass 4.x in the lockfile does not build on newer Node versions. Run `nvm use` before installing.

## Commands

```bash
npm start              # Dev server on port 8888 (open, host 0.0.0.0)
npm run build          # Dev build → dist/
npm run build:prod     # Production build → dist/
npm run build:gh-pages # Production build with --base-href /folioAngular/ (used by CI)
npm test               # Jest unit tests
npm run test:watch     # Jest in watch mode
npm run test:ci        # Jest with coverage (CI mode; thresholds in jest.config.js)
npm run lint           # TSLint
```

## Architecture

Angular 5 portfolio SPA (Angular CLI 1.7.3). All data is static JSON fetched via `HttpClient` from `./assets/data/projectdissimilar/*.json` — there is no backend.

### Feature modules (`src/app/+*-page/`)

Each page is a lazy-loaded feature module using the `+` prefix convention. Most page folders follow a four-file shape — `*.component.ts`, `*.module.ts`, `*.routes.ts`, `*.service.ts` — but several deviate (e.g. `+faqs-page` has no `faqs-page.component.ts`; `+portfolio-page/project-details` has no `.routes.ts` and is routed eagerly). See [feature-page-pattern.md](./docs/wiki/feature-page-pattern.md) for the full pattern and every deviation before assuming uniformity. Services fetch static JSON from `src/assets/data/`; components are presentational.

Routes are registered in `app.routes.ts` via string-based `loadChildren` (Angular 5 pre-Ivy syntax). Each route carries a `data: { animation: '...' }` key consumed by the router animation in `app.component.ts`.

### Shared infrastructure

- `SharedModule` — re-exports common deps (Material, Router, ReactiveFormsModule, NavigationModule, ProjectDetailsModule). Import this in feature modules instead of importing individual pieces.
- `MaterialModule` (`src/app/shared/materialModule.ts`) — centralises all Angular Material imports.
- `animations.ts` — defines `routerAnimation` (slide-in/out), applied at the `AppComponent` level.
- `BrowserDetectService` — checks for Chrome/Firefox; `AppComponent` shows `BrowserUnsupportedComponent` if unsupported.
- Navigation items are defined statically in `src/app/shared/navigation/navigation-items.ts`.

### Styling

No component-level styles. All SCSS lives in `src/assets/styles/` and is imported through `src/assets/styles/main.scss` (the single entry point configured in `.angular-cli.json`). Structure: `base/`, `components/`, `layout/`, `pages/`, `themes/`, `utils/`, `vendors/`. FontAwesome is self-hosted in `src/assets/fonts/`.

### Testing

Unit tests use Jest (`jest.config.js`, `jest-preset-angular`), bootstrapped via `src/setup-jest.ts` with browser-API mocks in `src/setup-jest-global-mocks.ts`. Shared test stubs live in `src/testing/`.

### CI / Deployment / Releases

Single pipeline in `.github/workflows/ci.yml` (push + PR to `master`):

- **lint** and **test** run in parallel on Node 10.
- **build** (Node 10) runs `build:gh-pages`, adds `404.html` (copy of `index.html`, the GitHub Pages SPA fallback) and `.nojekyll`, and uploads the Pages artifact.
- **deploy** (master pushes only) publishes to GitHub Pages: <https://commitblob.github.io/folioAngular/>.
- **release** (master pushes only, Node 22 — semantic-release needs ≥ 20) runs semantic-release via npx (deliberately *not* in devDependencies, to keep the Node 10 lockfile clean). Config in `.releaserc.json`: analyses Conventional Commits, then creates a git tag `vX.Y.Z` and publishes a GitHub Release with auto-generated notes via `@semantic-release/github`. It does **not** commit anything back to the repo (no `@semantic-release/git`/`changelog`/`npm` plugins) — `master` is a protected branch, so the source of truth for versions is the git tags + GitHub Releases page, not `package.json`. Nothing in the app reads the version.

Use Conventional Commit messages (`fix:` → patch, `feat:` → minor, `feat!:`/`BREAKING CHANGE` → major); other types don't trigger releases.

- **Docker**: no `Dockerfile` or nginx config exists in this repo as of the current wiki anchor SHA — a prior version of this file described an nginx-based deployment that is not present in the tracked tree. Verify before relying on it; GitHub Pages (above) is the only deployment path currently wired in CI.

## Definition of Done

- `npm run lint` exits 0.
- `npm run test:ci` exits 0 (enforces the coverage thresholds in `jest.config.js`).
- `node docs/wiki/lint/lint.js` exits 0 (no stale wiki anchors) if `docs/wiki/` or any file it anchors changed.
