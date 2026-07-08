---
type: Subsystem
title: Shared Infrastructure
description: SharedModule/MaterialModule composition, the navigation-items vs route-table mismatch, the Bowser-based browser gate, and MetaTagsService quirks.
resource: https://github.com/commitBlob/folioAngular/blob/c4391ece5b07a47b84f5591808f3588a37f9ea7c/src/app/shared
tags: [subsystem, di, navigation, browser-detection, meta-tags, footgun]
timestamp: 2026-07-08T00:00:00Z
anchors:
  - src/app/shared/shared.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/materialModule.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/navigation/navigation-items.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/navigation/navigation.inteface.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/navigation/navigation.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/navigation/navigation.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/browser-detect/browser-detect.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/shared/meta-tags/meta-tags.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.html@c4391ece5b07a47b84f5591808f3588a37f9ea7c
---

# Shared Infrastructure

## Why this page exists

Five small files under `src/app/shared/` each look trivial in isolation, but together they encode coupling and mismatches invisible from any one of them: `SharedModule`'s re-export-without-import and reach into a feature subfolder, a navigation list that silently omits a real route, and a browser gate whose exact allowlist matters for who sees the app at all. Six source files, one page.

## `SharedModule` (`src/app/shared/shared.module.ts`)

- `imports`: `CommonModule, MaterialModule, RouterModule, ReactiveFormsModule` (lines 13-17).
- `exports`: `CommonModule, FormsModule, MaterialModule, NavigationModule, ProjectDetailsModule, RouterModule, ReactiveFormsModule` (19-27).
- **`FormsModule` is exported but never imported** in this module — legal Angular (re-exporting doesn't require importing), but easy to misdiagnose as a missing import if `FormsModule`-dependent directives fail to resolve elsewhere.
- **Depends on a feature subfolder:** imports `ProjectDetailsModule` from `../+portfolio-page/project-details/project-details.module` (line 10) and re-exports it (line 24) — so `SharedModule` is not purely generic infrastructure; any module importing `SharedModule` transitively gets the portfolio project-details component. This is also how the eagerly-routed `ProjectDetailsComponent` (see [routing-and-animation.md](./routing-and-animation.md)) becomes available without the portfolio lazy chunk.
- `forRoot()` (32-37) returns `{ ngModule: SharedModule, providers: [] }` — a no-op provider-wise. Only `AppModule` calls `SharedModule.forRoot()` (`app.module.ts:35`); every feature module imports plain `SharedModule`. There is currently no reason `forRoot()` needs to exist (empty `providers`), but changing/removing it changes `AppModule`'s import shape — leave it unless doing a deliberate cleanup.

## `MaterialModule` (`src/app/shared/materialModule.ts`)

Single-barrel import from `@angular/material` (Angular 5 style — this pattern is removed in later Angular Material versions, so this file cannot survive an Angular Material upgrade unchanged). Modules re-exported (lines 18-29): `MatTabsModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatDatepickerModule, MatExpansionModule`. Providers (38-42) wire the Moment date adapter for `MatDatepickerModule`: `DateAdapter → MomentDateAdapter`, `MAT_DATE_FORMATS → MAT_MOMENT_DATE_FORMATS`, `MAT_DATE_LOCALE → 'en-GB'`. Imported both by `AppModule` directly (`app.module.ts:13,32`) and via `SharedModule`/individual feature modules (e.g. `faqs-page.module.ts:7,14`, `contact-page.module.ts:11,17`) — i.e. some feature modules import it directly rather than relying on `SharedModule`'s re-export.

## Navigation (`src/app/shared/navigation/`)

- **Filename/identifier typo, load-bearing:** the interface file is `navigation.inteface.ts` (missing "r"), exporting `interface NavigationInteface { linkName: string; linkPath: string; linkIcon: string; linkSubName?: string; }` (`navigation.inteface.ts:1-6`). Any new code referencing navigation types must import this exact misspelled name — grepping for "interface" (correctly spelled) will not find this file.
- `navigation-items.ts:3-30` exports `const GlobalNavigation: NavigationInteface[]`, a **static, hardcoded** array, 5 entries in display order: `about` (`fas fa-user`), `skills` (`fab fa-superpowers`, with `linkSubName: 'SKILLS'` — displayed label is "SUPERPOWERS"), `experience` (`fas fa-road`), `portfolio` (`fas fa-cubes`), `contact` (`fas fa-envelope`).
- **`faqs` is a real, routable page (`app.routes.ts:40-43`) that is absent from `GlobalNavigation`** — it's reachable only by direct URL, never surfaced in the nav UI. If asked to "add a link for every page," don't assume the current nav list is the full route set.
- `NavigationService.getNavigation()` (`navigation.service.ts:9-11`) just returns `GlobalNavigation` verbatim — no filtering, no async, no HTTP. `NavigationModule` (`navigation.module.ts`) declares/exports `NavigationComponent` and provides `NavigationService`.

## Browser gate

- `BrowserDetectService.chromeOrFirefoxCheck()` (`browser-detect.service.ts:8-13`) uses **Bowser 2.x**: `Bowser.getParser(window.navigator.userAgent).getBrowserName()`, then `return (browserName === 'Chrome' || browserName === 'Firefox')`. This is **string equality against Bowser's canonical browser name**, not a user-agent regex — any browser Bowser doesn't label exactly `'Chrome'` or `'Firefox'` (Edge, Safari, Chromium-based forks, etc.) fails the check.
- Consumed once, in `AppComponent`'s constructor: `this.browserSupported = browserService.chromeOrFirefoxCheck();` (`app.component.ts:17-18`) — computed once at app bootstrap, not reactive to anything.
- Template gate: `app.component.html:1-2` — `<app-browser-unsupported *ngIf="!browserSupported else isChromeOrFF">`, with the entire real UI (nav, burger menu, animated router-outlet) inside the `#isChromeOrFF` `ng-template`. Failing the check means `BrowserUnsupportedComponent` renders and nothing else in the app tree ever mounts (no router, no nav).

## `MetaTagsService` (`src/app/shared/meta-tags/meta-tags.service.ts`)

Stateless helper (no HTTP), fields: `roleTitle = 'Senior Software Developer & Research Lead'`, `name = 'Maro Radovic'`, `currentCompany = 'Ntegra'` (lines 7-9). Methods build Angular `Meta`/`Title` payloads (never call `Meta`/`Title` themselves — callers do that):
- `setPageTitle(page)` → `` `${name} - ${roleTitle} | ${page}` `` (11-13).
- `setDescriptionMetaTag()` → `{name: 'description', content: ...}` interpolating `name`/`currentCompany`/`roleTitle` (15-19).
- `setMetaTag(tagName, tagContent)` → generic `{name, content}` passthrough (21-23).
- `setTwitterCard()` → `{name: 'twitter:card', value: 'summary'}` — **uses `value`, not `content`**, inconsistent with every other method here and with the real `content` key Angular's `Meta.addTag` expects for a `<meta>` tag; verify before relying on this for actual Twitter Card rendering. (21-27)
- `setContentType()` → `{httpEquiv: 'Content-Type', content: 'text/html', charset: 'utf-8'}` (29-31).
- **Cross-file mismatch:** `roleTitle` here (`'Senior Software Developer & Research Lead'`) disagrees with the static `<title>` in `src/index.html:5` (`'AI Solution Architect & Lead Forward Deployed Engineer'`). The dynamic per-page title (via `setPageTitle`, used by e.g. `FaqsBlockComponent.setMetaData()`, `faqs-block.component.ts:40-43`) overwrites the static one after bootstrap, so which string a user sees depends on timing/JS execution — treat both as sources of truth that need to agree, not just one.
