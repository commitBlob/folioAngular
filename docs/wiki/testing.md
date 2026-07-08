---
type: Playbook
title: Testing Playbook
description: Jest configuration, coverage thresholds, jsdom mock rationale, and the canonical service-spec / component-spec patterns to copy for new tests.
resource: https://github.com/commitBlob/folioAngular/blob/c4391ece5b07a47b84f5591808f3588a37f9ea7c/jest.config.js
tags: [playbook, testing, jest, coverage]
timestamp: 2026-07-08T00:00:00Z
anchors:
  - jest.config.js@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/setup-jest.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/setup-jest-global-mocks.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/testing/meta-stubs.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/+about-page/about-page.service.spec.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
  - src/app/app.component.spec.ts@c4391ece5b07a47b84f5591808f3588a37f9ea7c
---

# Testing Playbook

## Why this page exists

New tests need to match an established pattern (Jest + `jest-preset-angular`, specific mock providers, a specific coverage gate) that spans 4 infra files plus ~25 spec files. Getting any of this wrong either fails CI (`test:ci` enforces coverage thresholds) or silently duplicates jsdom shims that already exist globally.

## Configuration (`jest.config.js`)

```js
preset: 'jest-preset-angular'
setupTestFrameworkScriptFile: '<rootDir>/src/setup-jest.ts'
roots: ['<rootDir>/src']
globals: { 'ts-jest': { tsConfigFile: 'src/tsconfig.spec.json' }, __TRANSFORM_HTML__: true }
```
(`jest.config.js:1-10`)

Coverage (`jest.config.js:11-28`):
- `collectCoverageFrom`: `src/app/**/*.ts` **excluding** `**/*.module.ts`, `**/*.routes.ts`, `**/*.spec.ts`, `src/testing/**`.
- **Global thresholds (exact, hard gate on `npm run test:ci`):** `statements: 90, branches: 80, functions: 90, lines: 90`.
- Reporters: `html`, `lcovonly`, `text-summary`; output dir `<rootDir>/coverage` (uploaded as a CI artifact regardless of pass/fail, `.github/workflows/ci.yml:35-39`).

## Bootstrap files

- `src/setup-jest.ts` (`setupTestFrameworkScriptFile`) — two lines: `import 'jest-preset-angular'; import './setup-jest-global-mocks';`. This replaces the Karma-era `src/test.ts`.
- `src/setup-jest-global-mocks.ts` — stubs browser APIs jsdom doesn't implement, applied to **every** test file globally:
  - `localStorage`/`sessionStorage` — in-memory closure-backed mock (lines 4-15).
  - `window.matchMedia` → `{ matches: false, addListener, removeListener }` (17-23) — comment: "Angular Material reads matchMedia/getComputedStyle on init."
  - `window.getComputedStyle` → `{ getPropertyValue: () => '' }` (25-29).
  - `Element.prototype.scrollIntoView` → no-op, `writable: true` (31-34) — needed because `ExperiencePageComponent` calls `scrollIntoView` (see `experience-page.component.ts`); without this mock any spec touching that component throws in jsdom.
- `src/testing/meta-stubs.ts` — shared fakes for the `Meta`/`Title`/`MetaTagsService` trio reused across page-component specs, deliberately excluded from coverage (not imported by production code):
  - `metaSpy()` → `{ addTag: jest.fn(), addTags: jest.fn() }`
  - `titleSpy()` → `{ setTitle: jest.fn() }`
  - `metaTagsServiceStub()` → fake implementations of all 5 `MetaTagsService` methods (see [shared-infrastructure.md](./shared-infrastructure.md) for the real ones).

## Canonical service-spec pattern

`HttpClientTestingModule` + `HttpTestingController`, one `describe` per service. From `about-page.service.spec.ts:1-19` (identical shape reused across every HTTP-backed service spec, e.g. `portfolio-page.service.spec.ts`):

```ts
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [AboutPageService]
});
service = TestBed.get(AboutPageService);
httpMock = TestBed.get(HttpTestingController);
jest.spyOn(console, 'error').mockImplementation(() => {}); // silence handleError's console.error
```
`afterEach(() => httpMock.verify())` (line 19) ensures no unexpected outstanding requests. Assertions use `httpMock.expectOne('<exact relative URL>')`, check `req.request.method === 'GET'`, then `req.flush(data)` for the happy path or `req.error(new ErrorEvent(...))` to exercise the `catch`/`handleError` branch (`about-page.service.spec.ts:41-58` also unit-tests `handleError` directly by casting the service `as any` to reach the private method).

## Canonical component-spec pattern

From `app.component.spec.ts:1-23`: provide hand-rolled `jest.fn()`-based stubs for injected services (never the real service), use `NO_ERRORS_SCHEMA` to skip unknown child-element errors, and `overrideComponent(X, { set: { template: '', animations: [] } })` to strip the real template/animations when the spec only exercises component-class logic:

```ts
TestBed.configureTestingModule({
  declarations: [AppComponent],
  providers: [{ provide: BrowserDetectService, useValue: browserService }],
  schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(AppComponent, { set: { template: '', animations: [] } });
```

Page components that need `Meta`/`Title`/`MetaTagsService` should provide `metaSpy()`/`titleSpy()`/`metaTagsServiceStub()` from `src/testing/meta-stubs.ts` rather than re-declaring fakes inline.

## Checklist for a new spec

1. Service spec → `HttpClientTestingModule` + `HttpTestingController`, silence `console.error`, `httpMock.verify()` in `afterEach`, assert on the exact `'./assets/data/projectdissimilar/<name>.json'` URL string.
2. Component spec → stub every injected service with `jest.fn()`-based providers (or the shared `meta-stubs.ts` helpers), `NO_ERRORS_SCHEMA` + `overrideComponent` if you only need class-level behavior.
3. Check `jest.config.js`'s `collectCoverageFrom` excludes before assuming a new `.module.ts`/`.routes.ts` needs its own spec — those are intentionally uncovered.
4. Run `npm run test:ci` locally before pushing; it fails the whole suite if global coverage drops below 90/80/90/90 (statements/branches/functions/lines).
