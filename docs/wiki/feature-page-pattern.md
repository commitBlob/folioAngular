---
type: Convention
title: Feature-Page Pattern
description: The canonical component/module/routes/service shape used by the six lazy-loaded feature pages, and every real deviation from it.
resource: https://github.com/commitBlob/folioAngular/blob/c4391ece5b07a47b84f5591808f3588a37f9ea7c/src/app
tags: [convention, routing, angular-module, footgun]
timestamp: 2026-07-08T00:00:00Z
anchors:
  - src/app/+about-page/about-page.component.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+about-page/about-page.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+about-page/about-page.routes.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+about-page/about-page.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+faqs-page/faqs-block.component.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+faqs-page/faqs-page.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+faqs-page/faqs-page.routes.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+contact-page/contact-page.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+contact-page/contact-page.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+portfolio-page/project-details/project-details.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+experience-page/experience-page.module.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+skills-page/skills-page.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+portfolio-page/portfolio-page.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+experience-page/experience-page.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+portfolio-page/project-details/project-details.service.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
---

# Feature-Page Pattern

## Why this page exists

CLAUDE.md (repo root) claims: "Every page folder contains the same four files: `*.component.ts`, `*.module.ts`, `*.routes.ts`, `*.service.ts`." This is **false** for 3 of the 6 feature pages, in ways that would mislead an agent adding a 7th page or refactoring an existing one. This page compresses the real pattern plus every deviation, spanning ~30 files across 6 folders — well over the compression bar, and none of it is visible from reading any single file.

## The canonical shape (about, portfolio, skills — the pages that actually match CLAUDE.md)

1. **`*.routes.ts`** exports `const XRoutes: ModuleWithProviders = RouterModule.forChild(routes)`, where `routes: Routes` is a local const with one entry `{ path: '', component: XComponent }`. Example, `src/app/+about-page/about-page.routes.ts:6-12`:
   ```ts
   const routes: Routes = [{ path: '', component: AboutPageComponent }];
   export const AboutPageRoutes: ModuleWithProviders = RouterModule.forChild(routes);
   ```
2. **`*.module.ts`** imports `CommonModule` + the page's own `XRoutes`, declares `XComponent`, and provides `XService` — never provides the service on the component itself. `src/app/+about-page/about-page.module.ts:10-21`.
3. **`*.service.ts`** is `@Injectable()` (module-provided, see above), injects `HttpClient`, does `this.http.get('./assets/data/projectdissimilar/<name>.json').catch(this.handleError)` per method, and carries a private `handleError` copy-pasted verbatim across every HTTP service (log `'Whoops, something went wrong'`, rethrow via `Observable.throw`). `src/app/+about-page/about-page.service.ts:12-28`.
4. **`*.component.ts`** is presentational, injects the service (and often `Meta`/`Title`/`MetaTagsService`), calls the service in `ngOnInit`.
5. Registered lazily in root `app.routes.ts` via string `loadChildren: 'app/+x-page/x-page.module#XPageModule'` — see [routing-and-animation.md](./routing-and-animation.md).

## Deviations (real, current, code-confirmed)

| Page | Deviation | Citation |
|---|---|---|
| `+faqs-page` | **No `faqs-page.component.ts`.** The routed component is `FaqsBlockComponent` (selector `faqs-block`), declared in `FaqsPageModule` and routed by `FaqsPageRoutes`. | `src/app/+faqs-page/faqs-page.routes.ts:6,11`, `src/app/+faqs-page/faqs-page.module.ts:6,18` |
| `+faqs-page` | Its route in root `app.routes.ts` has **no `data.animation`** — the only lazy page missing this key (`**` also lacks it, but that's the wildcard). | `src/app/app.routes.ts:40-43` |
| `+faqs-page` | `FaqsBlockComponent.navigateBack()` clears `this.faqs = []` before calling `location.back()` — an explicit workaround comment: `// workaround to prevent animation trigger when user leaves the page`. `ngOnInit` also defers assigning the fetched list by `setTimeout(..., 500)` — comment `// don't rush`. Both are non-obvious timing couplings to the router animation, not bugs to "fix" on sight. | `src/app/+faqs-page/faqs-block.component.ts:26-30,32-37` |
| `+contact-page` | **`ContactPageService` makes no HTTP call at all.** `submitForm()` is a stub: `return Observable.of(null);`. There is no `contact.json` and no `HttpClient` import in the service. | `src/app/+contact-page/contact-page.service.ts:6-11` |
| `+contact-page` | Module additionally imports `FormsModule`, `MaterialModule`, `ReactiveFormsModule`, and `SharedModule` — no other feature module imports all four. | `src/app/+contact-page/contact-page.module.ts:14-21` |
| `+portfolio-page/project-details/` (nested) | **No `.routes.ts` file at all.** It is not lazy-loaded — `ProjectDetailsComponent` is imported directly into root `app.routes.ts` and routed eagerly at `path: 'portfolio/:project'`. Its module only declares+exports the component and provides `ProjectDetailsService`; nothing calls `RouterModule.forChild` for it. | `src/app/+portfolio-page/project-details/project-details.module.ts:10-26`, `src/app/app.routes.ts:6,45-47` |
| `+portfolio-page/project-details/` | Its module is imported by `SharedModule` (not by `PortfolioPageModule`), so the eager route can resolve the component without going through the lazy portfolio chunk. See [shared-infrastructure.md](./shared-infrastructure.md). | `src/app/shared/shared.module.ts:10,24` |
| `+experience-page` | Two nested child components, `experience-projects/experience-projects.component.ts` and `career-timeline/career-timeline.component.ts`, have **no per-folder module** — both are declared directly in the parent `ExperiencePageModule`. | `src/app/+experience-page/experience-page.module.ts:9-10,17-21` |
| `+experience-page` | Service method is named `getProjectsList()` (not `getProjects()` like portfolio's identically-shaped call) and wraps the response: `.map((res: any[]) => ({ payload: res }))` before `.catch`. Don't assume symmetry with `PortfolioPageService.getProjects()`, which returns the raw array. | `src/app/+experience-page/experience-page.service.ts:13-17` vs `src/app/+portfolio-page/portfolio-page.service.ts:12-14` |
| `+skills-page` | Only service with a typed return: `getSkillsList(): Observable<SkillsInterface[]>` (`SkillsInterface` in `skills.interface.ts`). Every other service returns `Observable<any>`. | `src/app/+skills-page/skills-page.service.ts:15`, `src/app/+skills-page/skills.interface.ts:1-7` |

## Net effect for an agent adding a new page

- Default to the about/portfolio/skills shape (4 files, `forChild` routes, module-level service provider, copy the `handleError` block verbatim).
- Do not assume a `*-page.component.ts` filename exists — check the module's `declarations` first (faqs breaks this).
- Do not assume every feature has a `.routes.ts` — project-details doesn't, because it's eagerly routed from root.
- If the new page needs no backend data, model it on contact (`Observable.of(...)` stub), not on the HTTP services.
