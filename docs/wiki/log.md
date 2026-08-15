---
type: Log
title: Wiki Change Log
description: Append-only history of wiki builds and re-anchors for docs/wiki.
resource: https://github.com/commitBlob/folioAngular/blob/c4391ece5b07a47b84f5591808f3588a37f9ea7c/docs/wiki
tags: [log]
timestamp: 2026-07-08T00:00:00Z
anchors: []
---

# Wiki Change Log

Append entries to the top... no — append to the **bottom**, newest last, so `grep "^## \[" log.md | tail` shows the most recent entries. Every entry starts with `## [YYYY-MM-DD] <op> | <summary>`.

## [2026-07-08] build | Initial wiki build, anchor c4391ece5b07a47b84f5591808f3588a37f9ea7c

Scope: `INGEST_SCOPE=root`, full repo (189 tracked files, ~90 TS sources under `src/app/`). Repo assessed as small/highly-greppable (operating principle 6) — produced the dense `index.md` map plus 4 domain pages that each clear the N_COMPRESS=3 bar:

- `feature-page-pattern.md` — spans 6 feature-page folders (~30 files); corrects CLAUDE.md's false "same four files" claim.
- `routing-and-animation.md` — non-obvious control flow across 4 files (`app.routes.ts`, `app.component.ts/html`, `animations.ts`).
- `shared-infrastructure.md` — coupling invisible from any single file across 6 files under `src/app/shared/`.
- `testing.md` — Jest config + jsdom mock rationale + spec patterns spanning ~25 spec files + 4 infra files.

Also updated root `CLAUDE.md` to link to this wiki, fix the "same four files" overstatement, and correct/flag the Docker/nginx paragraph (referenced files not present in the tracked tree as of this SHA).

Flagged as UNKNOWN / discrepancy (code wins, doc did not match):
- `nginx-custom.conf` / `Dockerfile` referenced by prior `CLAUDE.md` — absent from `git ls-files` at this SHA.
- `src/index.html:5` page `<title>` role string vs `MetaTagsService.roleTitle` (`meta-tags.service.ts:7`) — two disagreeing sources of truth, not resolved by this run.
- `MetaTagsService.setTwitterCard()` uses `value` instead of `content` (`meta-tags.service.ts:25-27`) — flagged, not changed (documentation task, not a bug-fix task).

## [2026-08-15] fix | Consolidated name/roleTitle/currentCompany/siteUrl into src/app/shared/profile/profile.ts

Resolved the `index.html`-vs-`MetaTagsService.roleTitle` mismatch flagged in the 2026-07-08 build entry above. New file `src/app/shared/profile/profile.ts` (plain exported const, no DI) is now the single source for `name`, `roleTitle`, `currentCompany`, `siteUrl`, `ogImage`. `MetaTagsService` and `AboutPageComponent` both read from it instead of hardcoding their own copies. Also fixed two stale values discovered in the process: `currentCompany` was `'Ntegra'` (a 2019–2021 job per `positions.json`), corrected to `'Version 1'`; and `about-page.component.ts`'s OG/Twitter tags hardcoded the retired `http://maro.guru` domain four times, corrected to the actual GitHub Pages host `https://commitblob.github.io/folioAngular/`. `src/index.html:5` still can't import the constant (static shell, outside Angular's DI) — left as a manually-synced copy, currently in sync. Updated `index.md`'s gotcha table and this page's `shared-infrastructure.md` section accordingly; anchor SHAs for touched files still need bumping to this change's commit hash (see `docs/wiki/lint/README.md` re-anchoring step).

## [2026-08-15] fix | Wiki linter now line-ending agnostic; dead type annotation fixed in project-details

Two unrelated fixes from the same bug-hunt session.

1. `docs/wiki/lint/lint.js`'s frontmatter parser assumed bare-LF line endings (`^---\n` fence regex). This repo has `core.autocrlf=true`, so every wiki page is CRLF on a Windows checkout — the regex silently failed to match `---\r\n`, and `parseFrontmatter` returned `null` for every page, producing a false `ERROR ... missing or invalid frontmatter (no \`type\`)` for all 6 pages regardless of actual staleness. Invisible on the LF-checkout CI runners this repo actually uses, but broke the linter for any Windows contributor — even though root `CLAUDE.md`'s Definition of Done calls for running it whenever `docs/wiki/` changes. Fixed by normalizing CRLF→LF immediately after every `fs.readFileSync` and after the `git show` output used for historical comparison, so all downstream regex/split logic in the file operates on one consistent convention regardless of checkout platform. `docs/wiki/lint/README.md` gained one sentence documenting this. Re-running the fixed linter against the real (CRLF) working tree surfaced two **genuine**, previously-masked stale anchors, left unresolved by this entry (out of scope — re-anchoring is a deliberate separate step per the linter's own README): `feature-page-pattern.md ← src/app/+about-page/about-page.component.ts` (changed in `73eaf99`) and `index.md ← package.json` (changed in `6997297`).
2. `src/app/+portfolio-page/project-details/project-details.component.ts:24` declared `activeImageTitle: '';` — a type annotation (frozen `""` string-literal type), not the initialiser (`= ''`) every sibling field around it uses. Field was actually `undefined` at runtime despite the type claiming only `''` was valid; only compiled because `galleryList = []` is untyped `any[]`, so assignments to it were always `any`. Fixed to `activeImageTitle = '';`, which also let two pre-existing `as any` casts in `project-details.component.spec.ts` be removed as no longer necessary. Not referenced anywhere in `docs/wiki/`; `project-details.component.ts` is not anchor-pinned in any wiki page's frontmatter, so no re-anchoring needed.

Both verified via `npm run lint`, `npm run test:ci` (133/133 passing, coverage above `jest.config.js` gate), and `npm run build`.
