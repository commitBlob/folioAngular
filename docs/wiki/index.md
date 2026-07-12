---
type: Index
title: folioAngular Wiki — Dense Map
description: One-pass map of the folioAngular Angular 5 portfolio SPA — directories, commands, conventions, and the file/test/fixture matrix.
resource: https://github.com/commitBlob/folioAngular/blob/c4391ece5b07a47b84f5591808f3588a37f9ea7c
tags: [index, map, angular, portfolio-spa]
timestamp: 2026-07-08T00:00:00Z
anchors:
  - package.json@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - .github/workflows/ci.yml@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - .angular-cli.json@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - .releaserc.json@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/index.html@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.routes.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.html@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - jest.config.js@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/shared.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/navigation/navigation-items.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/navigation/navigation.inteface.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/browser-detect/browser-detect.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/meta-tags/meta-tags.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+about-page/about-page.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
---

# folioAngular — Dense Map

Angular 5 (CLI 1.7.3) portfolio single-page app. No backend — every "API" call is `HttpClient.get()` against a static JSON file under `src/assets/data/projectdissimilar/`. 189 tracked files total; ~90 TypeScript sources under `src/app/`.

**Repo verdict:** small and highly greppable — one concept ≈ one small file for most of the tree. This map plus 4 domain pages is the whole wiki; do not expect (or add) a page per file.

Anchor SHA for this wiki build: `c4391ece5b07a47b84f5591808f3588a37f9ea7c` (branch `master`). Freshness is enforced by the linter — see [lint/README.md](./lint/README.md).

## Directory table of contents

| Path | What lives here |
|---|---|
| `src/app/+about-page/`, `+contact-page/`, `+experience-page/`, `+faqs-page/`, `+portfolio-page/`, `+skills-page/` | Lazy-loaded feature modules, one per route. See [feature-page-pattern.md](./feature-page-pattern.md). |
| `src/app/404-page/` | `PageNotFoundComponent` + `PageNotFoundModule`, eagerly imported into `AppModule` (not lazy). |
| `src/app/shared/` | Cross-cutting infra: `SharedModule`, `MaterialModule`, navigation, browser detection, meta tags. See [shared-infrastructure.md](./shared-infrastructure.md). |
| `src/app/app.routes.ts`, `animations.ts`, `app.component.*` | Root route table + router-transition animation wiring. See [routing-and-animation.md](./routing-and-animation.md). |
| `src/assets/data/projectdissimilar/*.json` | The entire "backend" — 10 static JSON fixtures fetched by feature services. |
| `src/assets/styles/` | All SCSS. Single entry point `src/assets/styles/main.scss` (wired via `.angular-cli.json:19-21`). **No component has `styleUrls`** — do not add one without checking this convention first. |
| `src/assets/fonts/` | Self-hosted FontAwesome webfonts. |
| `src/environments/` | `environment.ts` (`{production:false}`) / `environment.prod.ts` — only `production` flag, nothing else is read from it. |
| `src/testing/meta-stubs.ts` | Shared Jest stubs for `Meta`/`Title`/`MetaTagsService`, excluded from coverage. See [testing.md](./testing.md). |
| `.github/workflows/ci.yml` | Single pipeline: lint + test → build → deploy (Pages) / release (semantic-release). |
| `docs/wiki/` | This wiki. `docs/sass_structure.txt` is a pre-existing, unrelated note — leave as is. |

## Entry points + exact commands

Requires **Node 10** (`.nvmrc:1` = `10`) — `node-sass@4.x` in the lockfile does not build on newer Node. Run `nvm use` before `npm ci`.

| Purpose | Command | Source |
|---|---|---|
| Install | `npm ci` (after `nvm use`) | — |
| Dev server | `npm start` → `ng serve --open --port 8888` | `package.json:8` |
| Dev build | `npm run build` → `ng build` | `package.json:9` |
| Prod build | `npm run build:prod` → `ng build --prod` | `package.json:10` |
| CI/Pages build | `npm run build:gh-pages` → `ng build --prod --base-href /folioAngular/` | `package.json:11` |
| Unit tests | `npm test` → `jest` | `package.json:12` |
| Tests, watch | `npm run test:watch` → `jest --watch` | `package.json:13` |
| Tests, CI mode + coverage | `npm run test:ci` → `jest --ci --coverage --runInBand` | `package.json:14` |
| Lint | `npm run lint` → `ng lint` | `package.json:15` |

CI job graph (`.github/workflows/ci.yml`): `lint` and `test` run in parallel on Node 10 (`node-version-file: .nvmrc`) → `build` (`needs: [lint, test]`, Node 10, runs `build:gh-pages`, then copies `dist/` to `site/`, adds `site/404.html` = copy of `index.html` and `site/.nojekyll`) → `deploy` (`needs: build`, push-to-master only, `actions/deploy-pages@v4`). `release` (`needs: [lint, test]`, push-to-master only) runs on **Node 22** (pinned, not `.nvmrc`) via `npx --yes -p semantic-release@24 semantic-release` — semantic-release is deliberately absent from `devDependencies` to keep the Node-10 lockfile clean (`.github/workflows/ci.yml:75-80`).

## Convention / rule registry

Facts an agent cannot get from a single grep — read this before editing.

| Rule | Detail | Citation |
|---|---|---|
| Lazy route module syntax | Pre-Ivy **string** `loadChildren`, form `'app/+X-page/x-page.module#XPageModule'` (app-root-relative path, `#` before class name). Cannot be changed to dynamic-import syntax without an Angular upgrade. | `src/app/app.routes.ts:17,22,27,32,37,42` |
| `.routes.ts` export shape | Every feature `*.routes.ts` exports `const XRoutes: ModuleWithProviders = RouterModule.forChild(routes)` — not a raw `Routes` array — and is imported straight into the module's `imports`. | `src/app/+about-page/about-page.routes.ts:6-12` |
| Services live in module `providers` | Never provided in a component; every feature module's `@NgModule({ providers: [XService] })`. | `src/app/+about-page/about-page.module.ts:18-20` |
| JSON fetch URLs | Always the literal relative string `'./assets/data/projectdissimilar/<name>.json'` passed to `HttpClient.get()` — not an environment-driven base URL. | `src/app/+about-page/about-page.service.ts:13,17` |
| Duplicated error handler | Every HTTP-backed service repeats an identical private `handleError(error)` → logs `'Whoops, something went wrong'` to console and does `Observable.throw(errMsg)`. Not extracted to a shared util — if you add a service, copy this pattern rather than inventing a new one. | `src/app/+about-page/about-page.service.ts:23-28` (representative; same body in contact/experience/faqs/portfolio/project-details/skills services) |
| RxJS 5 patch-operator style | `import 'rxjs/add/operator/catch'` / `.../map`, `Observable.throw`, `Observable.of`, `Observable.forkJoin` — **not** pipeable `pipe(catchError(...))` RxJS 6 style. Mixing styles will break the build. | `src/app/+about-page/about-page.service.ts:4-6` |
| No component styles | All SCSS routes through the single entry `src/assets/styles/main.scss` (`.angular-cli.json:19-21`); no `@Component` in the repo declares `styleUrls`. | `.angular-cli.json:19-21` |
| `faqs` and `**` routes have no `data.animation` | `getRouteAnimation()` returns `undefined` for these paths; the `'* <=> *'` transition still fires but with an undefined trigger value. Don't assume every route animates identically. | `src/app/app.routes.ts:40-43,49-52` |
| Route animation reads `activatedRouteData`, not `route.data` | `getRouteAnimation(outlet) { return outlet.activatedRouteData.animation; }`, called with the `#route="outlet"` template ref on `<router-outlet>`. | `src/app/app.component.ts:29-31`, `src/app/app.component.html:10-11` |
| Base href differs by build target | Dev/local: `<base href="/">` in `src/index.html:6`. GH Pages CI build overrides via `--base-href /folioAngular/` (`package.json:11`). Serving a `build:gh-pages` output at root (or vice versa) breaks all asset paths. | `src/index.html:6`, `package.json:11` |
| Coverage thresholds (global, hard gate) | `statements: 90, branches: 80, functions: 90, lines: 90`. `test:ci` (`jest --ci --coverage --runInBand`) fails the run if unmet. | `jest.config.js:21-28` |
| Coverage excludes | `*.module.ts`, `*.routes.ts`, `*.spec.ts`, `src/testing/**` are excluded from `collectCoverageFrom` — don't expect coverage numbers to include DI wiring. | `jest.config.js:14-20` |
| Conventional Commits drive releases | `fix:`→patch, `feat:`→minor, `feat!:`/`BREAKING CHANGE`→major; other prefixes (`docs:`, `chore:`, …) do not trigger a release. `.releaserc.json` has no git/changelog/npm plugin — `master` is protected, versions live only in git tags + GitHub Releases, nothing in `package.json` is bumped. | `.releaserc.json:1-8` |
| `NavigationInteface` filename/identifier typo | File is `navigation.inteface.ts` (missing "r"), interface is `NavigationInteface`. Grepping for "interface" will miss it; new code must import the misspelled name to match. | `src/app/shared/navigation/navigation.inteface.ts:1` |
| Nav items ≠ full route set | `GlobalNavigation` (5 items: about/skills/experience/portfolio/contact) omits `faqs` entirely — `/faqs` is only reachable by direct URL. | `src/app/shared/navigation/navigation-items.ts:3-30` |
| `SharedModule` re-exports `FormsModule` without importing it | `exports: [..., FormsModule, ...]` while only `ReactiveFormsModule` is in `imports` — legal Angular (re-export doesn't require import) but easy to misread as a bug. `forRoot()` returns `{ ngModule: SharedModule, providers: [] }` — a no-op used only by `AppModule`; feature modules import plain `SharedModule`. | `src/app/shared/shared.module.ts:19-27,32-37` |
| `SharedModule` depends on a feature subfolder | `SharedModule` imports/exports `ProjectDetailsModule` from `../+portfolio-page/project-details/...` — shared infra reaching into a specific feature page. `ProjectDetailsComponent` is also routed **eagerly** (not lazy) directly from root `app.routes.ts:6,45-47`, unlike every other page. | `src/app/shared/shared.module.ts:10,24` |
| CLAUDE.md's "same four files" claim is not accurate | See [feature-page-pattern.md](./feature-page-pattern.md) for every deviation (faqs has no `*-page.component`; contact service does no HTTP; project-details has no `.routes.ts`; experience's nested components have no per-folder module). Code wins — treat the four-file shape as the common case, not an invariant. | n/a — cross-file finding |
| Docker deployment section in CLAUDE.md is unverified | CLAUDE.md (root) mentions `nginx-custom.conf` and an nginx Docker deployment; **no `Dockerfile` or `nginx*` file exists anywhere in the tracked tree** (confirmed via `git ls-files` glob, this run). Treat that CLAUDE.md paragraph as stale/aspirational until such a file is added. | n/a — absence confirmed against `git ls-files` |
| Page `<title>` vs `MetaTagsService.roleTitle` disagree | `src/index.html:5` title says "AI Solution Architect & Lead Forward Deployed Engineer"; `MetaTagsService.roleTitle` (used by every page's dynamic `<title>` via `Title.setTitle`) says `'Senior Software Developer & Research Lead'`. Two sources of truth for the same fact — pick one before editing either. | `src/index.html:5`, `src/app/shared/meta-tags/meta-tags.service.ts:7` |
| Browser gate is a string-equality allowlist, not a UA regex | `BrowserDetectService.chromeOrFirefoxCheck()` uses Bowser's `getBrowserName()` and passes only for the literal strings `'Chrome'` or `'Firefox'` — every other browser (including Edge, Safari, Chromium forks Bowser doesn't label exactly "Chrome") renders `BrowserUnsupportedComponent` instead of the app. | `src/app/shared/browser-detect/browser-detect.service.ts:8-13` |

## File / test / fixture matrix

| Domain | Key source file(s) | Spec(s) | JSON fixture(s) consumed |
|---|---|---|---|
| About | `+about-page/about-page.component.ts`, `.service.ts` | `about-page.component.spec.ts`, `about-page.service.spec.ts` | `profile_pictures.json`, `social_icons.json` |
| Contact | `+contact-page/contact-page.component.ts`, `.service.ts` (no HTTP — `submitForm()` returns `Observable.of(null)`, `contact-page.service.ts:8-10`) | `contact-page.component.spec.ts`, `contact-page.service.spec.ts` | none |
| Experience | `+experience-page/experience-page.component.ts`, `.service.ts`, nested `experience-projects/experience-projects.component.ts`, `career-timeline/career-timeline.component.ts` (both declared directly in `experience-page.module.ts:17-20`, no per-folder module) | `experience-page.component.spec.ts`, `.service.spec.ts`, `experience-projects.component.spec.ts`, `career-timeline.component.spec.ts` | `projects.json` (wrapped `{payload: res}`, `experience-page.service.ts:13-17`), `positions.json`, `education.json`, `career_progression.json` |
| FAQs | `+faqs-page/faqs-block.component.ts` (page component — **not** named `faqs-page.component.ts`), `.service.ts` | `faqs-block.component.spec.ts`, `faqs-page.service.spec.ts` | `faqs_list.json` |
| Portfolio | `+portfolio-page/portfolio-page.component.ts`, `.service.ts` + nested `project-details/project-details.component.ts`, `.service.ts` (no `.routes.ts`; routed eagerly from root, see rule registry) | `portfolio-page.component.spec.ts`, `.service.spec.ts`, `project-details.component.spec.ts`, `.service.spec.ts` | `projects.json`, `project_details.json` (filtered client-side by `String(item.id) === String(projectId)`, `project-details.service.ts:15`) |
| Skills | `+skills-page/skills-page.component.ts`, `.service.ts`, `skills.interface.ts` (only service with a typed return: `Observable<SkillsInterface[]>`) | `skills-page.component.spec.ts`, `.service.spec.ts` | `skills_list.json`, `skills_content.json` |
| Navigation | `shared/navigation/navigation.component.ts`, `.service.ts`, `navigation-items.ts`, `navigation.inteface.ts` (typo'd filename) | `navigation.component.spec.ts`, `.service.spec.ts` | none (static in-memory array) |
| Browser gate | `shared/browser-detect/browser-detect.service.ts` (Bowser-based), `shared/browser-unsupported/browser-unsupported.component.ts` | `browser-detect.service.spec.ts`, `browser-unsupported.component.spec.ts` | none |
| Meta tags | `shared/meta-tags/meta-tags.service.ts` | `meta-tags.service.spec.ts`; consumers use `src/testing/meta-stubs.ts` (`metaSpy`, `titleSpy`, `metaTagsServiceStub`) | none |
| App shell | `app.component.ts/html`, `app.module.ts`, `app.routes.ts`, `animations.ts` | `app.component.spec.ts` | none |
| 404 | `404-page/page-not-found.component.ts` (eager, `PageNotFoundModule` imported directly in `AppModule`, `app.module.ts:15,33`) | `page-not-found.component.spec.ts` | none |

Full JSON fixture inventory (`src/assets/data/projectdissimilar/`): `career_progression.json`, `education.json`, `faqs_list.json`, `positions.json`, `profile_pictures.json`, `project_details.json`, `projects.json`, `skills_content.json`, `skills_list.json`, `social_icons.json`.

## Domain pages

| Page | Type | Covers |
|---|---|---|
| [feature-page-pattern.md](./feature-page-pattern.md) | Convention | The canonical component/module/routes/service shape and every deviation from it across the 6 feature-page folders. |
| [routing-and-animation.md](./routing-and-animation.md) | ControlFlow | How `app.routes.ts` → `app.component.html` → `app.component.ts` → `animations.ts` cooperate to animate route transitions; the eager `ProjectDetailsComponent` route. |
| [shared-infrastructure.md](./shared-infrastructure.md) | Subsystem | `SharedModule`/`MaterialModule` composition, navigation-vs-routes mismatch, browser gate, meta-tags quirks. |
| [testing.md](./testing.md) | Playbook | Jest config, coverage thresholds, jsdom mock rationale, canonical service-spec and component-spec patterns to copy for new tests. |

Not documented as separate pages (greppable in one file, or a single CI/config file already fully described above): individual feature components/templates, the SCSS tree, `.angular-cli.json`/`.releaserc.json`/`tsconfig*.json` contents beyond what's in this map, `environments/*.ts`.

## Provenance

See [repos.json](./repos.json) for machine-readable provenance and [log.md](./log.md) for the append-only change history. Staleness is enforced by [lint/lint.js](./lint/lint.js) — see [lint/README.md](./lint/README.md).
