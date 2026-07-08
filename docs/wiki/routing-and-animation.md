---
type: ControlFlow
title: Routing and Router-Transition Animation
description: How the root route table, app shell template, and the routerAnimation trigger cooperate to slide pages in and out on navigation.
resource: https://github.com/commitBlob/folioAngular/blob/c4391ece5b07a47b84f5591808f3588a37f9ea7c/src/app/app.routes.ts
tags: [control-flow, routing, animation, footgun]
timestamp: 2026-07-08T00:00:00Z
anchors:
  - src/app/app.routes.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/animations.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.html@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
---

# Routing and Router-Transition Animation

## Why this page exists

The slide transition between pages is wired across 4 files with no single file showing the full path from "user navigates" to "trigger fires with the right value." This is the kind of non-obvious control flow operating principle 1 calls out.

## The flow

1. **`src/app/app.routes.ts`** — each top-level `Route` carries `data: { animation: '<name>' }` (verbatim values below). Lazy pages use pre-Ivy string `loadChildren`, e.g. `loadChildren: 'app/+about-page/about-page.module#AboutPageModule'` (`app.routes.ts:17`) — app-root-relative path, `#` before the exported module class name. This string form is why the app cannot move to Ivy/dynamic-import `loadChildren` without a framework upgrade.

   | Route | `data.animation` | Notes |
   |---|---|---|
   | `''` (redirect → `about`) | `'home'` | `app.routes.ts:9-14` |
   | `about` | `'about'` | lazy, `about-page.module#AboutPageModule` |
   | `contact` | `'contact'` | lazy |
   | `portfolio` | `'portfolio'` | lazy |
   | `skills` | `'skills'` | lazy |
   | `experience` | `'experience'` | lazy |
   | `faqs` | **none** | lazy; `data` key omitted entirely — `app.routes.ts:40-43` |
   | `portfolio/:project` | `'project-details'` | **eager** `component: ProjectDetailsComponent` — not lazy-loaded, imported directly at `app.routes.ts:6` |
   | `**` | **none** | `component: PageNotFoundComponent`, `app.routes.ts:49-52` |

2. **`src/app/app.component.html:10-11`** binds the trigger to the outlet's route data via a template reference variable:
   ```html
   <div [@routerAnimation]="getRouteAnimation(route)">
     <router-outlet #route="outlet"></router-outlet>
   </div>
   ```
   `#route="outlet"` exposes the `RouterOutlet` directive instance (not the `ActivatedRoute`) as `route`, which is what gets passed into `getRouteAnimation`.

3. **`src/app/app.component.ts:29-31`** reads the animation key from the outlet, not from `ActivatedRoute.snapshot.data`:
   ```ts
   getRouteAnimation(outlet) {
     return outlet.activatedRouteData.animation;
   }
   ```
   For `faqs` and `**`, this returns `undefined` — the transition (see below) still runs on `'* <=> *'` (any-state-change), but with an `undefined` binding value, so don't assume every route has a distinguishable animation identity.

4. **`src/app/animations.ts:9-41`** defines the trigger consumed by the `animations: [routerAnimation]` array on `AppComponent` (`app.component.ts:11`):
   - `transition('* <=> *', [...])` — fires on **any** state change, including to/from `undefined`.
   - `:enter` starts at `position: fixed; width: 100%; transform: translateX(-150%)`.
   - `:leave` animates to `position: fixed; width: 100%; transform: translateX(120%)` over `500ms ease-in`, `delay: 100`.
   - `:enter` then animates to `opacity: 1; transform: translateX(0%)` over `800ms ease-out`, `delay: 200`.
   - All three `query()` calls use `{optional: true}` so a missing enter/leave element doesn't throw.
   - **Footgun:** both outgoing and incoming views are `position: fixed` simultaneously during the overlap window — any other fixed-position element sharing the viewport can visually collide during the ~600ms transition.

5. **Gating before any of this runs:** `AppComponent` only renders the router-outlet branch if `browserSupported` is true (`app.component.html:1-2`, `*ngIf="!browserSupported else isChromeOrFF"`), set once in the constructor from `BrowserDetectService.chromeOrFirefoxCheck()` (`app.component.ts:17-18`). See [shared-infrastructure.md](./shared-infrastructure.md) for the browser gate itself.

6. Root wiring: `RouterModule.forRoot(routes)` and `SharedModule.forRoot()` in `AppModule.imports` (`app.module.ts:34-35`); `PageNotFoundModule` (holding `PageNotFoundComponent`) is imported **eagerly**, unlike every lazy feature module (`app.module.ts:15,33`).

## Practical implications

- Adding a new top-level route: give it a unique `data: { animation: '<name>' }` or accept it'll share the `undefined` bucket with `faqs`/`**`.
- The animation trigger has no per-route customization — all transitions use the same timings/easings regardless of `data.animation`'s value; the key only exists to force Angular to see a state change on the `[@routerAnimation]` binding (`'* <=> *'` matches any transition where the bound value differs, including `undefined → 'about'`).
- `ProjectDetailsComponent` is the one page reachable without a lazy chunk load — if profiling initial bundle size, it's already in the main bundle via `SharedModule → ProjectDetailsModule`.
