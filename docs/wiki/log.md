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
