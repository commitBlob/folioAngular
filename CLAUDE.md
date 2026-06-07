# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Dev server on port 8888 (open, host 0.0.0.0)
npm run start-dev      # Dev server + proxy to backend at localhost:7777
npm run build          # Dev build → dist/
npm run build:prod     # Production build → dist/
npm test               # Karma/Jasmine unit tests
npm run lint           # TSLint
npm run e2e            # Protractor end-to-end tests
```

Docker:
```bash
docker build -t $imageName .
docker run -p 80:80 $imageName
```

## Architecture

Angular 5 portfolio SPA (Angular CLI 1.7.3). All data comes from a backend API at `./api/*` — in dev, proxied to `localhost:7777` via `proxy.config.json`. In production, deployed to Azure Static Web Apps (master branch auto-deploys via `.github/workflows/`).

### Feature modules (`src/app/+*-page/`)

Each page is a lazy-loaded feature module using the `+` prefix convention. Every page folder contains the same four files: `*.component.ts`, `*.module.ts`, `*.routes.ts`, `*.service.ts`. Services fetch from the backend API; components are presentational.

Routes are registered in `app.routes.ts` via string-based `loadChildren` (Angular 5 pre-Ivy syntax). Each route carries a `data: { animation: '...' }` key consumed by the router animation in `app.component.ts`.

### Shared infrastructure

- `SharedModule` — re-exports common deps (Material, Router, ReactiveFormsModule, NavigationModule, ProjectDetailsModule). Import this in feature modules instead of importing individual pieces.
- `MaterialModule` (`src/app/shared/materialModule.ts`) — centralises all Angular Material imports.
- `animations.ts` — defines `routerAnimation` (slide-in/out), applied at the `AppComponent` level.
- `BrowserDetectService` — checks for Chrome/Firefox; `AppComponent` shows `BrowserUnsupportedComponent` if unsupported.
- `GoogleAnalyticsService` — injected in `AppModule` constructor to bootstrap GA.
- Navigation items are defined statically in `src/app/shared/navigation/navigation-items.ts`.

### Styling

No component-level styles. All SCSS lives in `src/assets/styles/` and is imported through `src/assets/styles/main.scss` (the single entry point configured in `.angular-cli.json`). Structure: `base/`, `components/`, `layout/`, `pages/`, `themes/`, `utils/`, `vendors/`. FontAwesome is self-hosted in `src/assets/fonts/`.

### Deployment

- **Docker**: nginx serves the `dist/` folder; `nginx-custom.conf` uses `try_files $uri $uri/ /index.html` for SPA routing.
- **Azure Static Web Apps**: GitHub Actions workflow auto-deploys on push to `master`; PRs get preview environments.
