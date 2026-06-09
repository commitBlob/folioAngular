# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Dev server on port 8888 (open, host 0.0.0.0)
npm run build          # Dev build → dist/
npm run build:prod     # Production build → dist/
npm test               # Jest unit tests
npm run test:watch     # Jest in watch mode
npm run test:ci        # Jest with coverage (CI mode)
npm run lint           # TSLint
```

## Architecture

Angular 5 portfolio SPA (Angular CLI 1.7.3). All data is static JSON fetched via `HttpClient` from `./assets/data/projectdissimilar/*.json` — there is no backend. The app is not deployed anywhere.

### Feature modules (`src/app/+*-page/`)

Each page is a lazy-loaded feature module using the `+` prefix convention. Every page folder contains the same four files: `*.component.ts`, `*.module.ts`, `*.routes.ts`, `*.service.ts`. Services fetch static JSON from `src/assets/data/`; components are presentational.

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
