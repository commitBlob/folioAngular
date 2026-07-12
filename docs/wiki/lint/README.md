# Wiki Staleness Linter

Zero-dependency Node script (`lint.js`, runs on Node 10 and Node 22 — no syntax beyond what both support). Lives in `docs/wiki/lint/`, checks pages in `docs/wiki/`.

**The linter flags. It does not fix.** Re-verifying a stale page against current code and re-anchoring it to a new SHA is a deliberate step — done by a human or a follow-up agent run that reads the diff, confirms the wiki's claims still hold (or updates them), and bumps the `anchors` frontmatter to the new SHA. Never automate that step away; that's what keeps the wiki trustworthy at query time.

**Drift is the primary failure mode of this whole system.** Expect the linter to flag pages after unrelated commits touch an anchored file — that's it working as intended, not a bug. Treat "run the linter, see red, go fix or acknowledge" as a normal loop, not an exception.

## Mode A — git staleness (default, gates CI)

```bash
node docs/wiki/lint/lint.js
```

For every wiki page:
1. Parses the `anchors` list from its frontmatter (`path@sha` or `path#Symbol@sha`).
2. For each anchor, fetches the file content at `sha` via `git show <sha>:<path>` and compares it, **whitespace-normalized** (all runs of whitespace collapsed to one space, then trimmed — so pure reformatting doesn't trip a false positive), against the file's current working-tree content.
3. Symbol anchors (`path#Symbol@sha`) do not get AST-level extraction in this implementation (no tree-sitter dependency in the stack) — they fall back to a **file-level** comparison and the output says so explicitly: `(symbol granularity unavailable — file-level check)`.
4. Prints one line per anchor:
   - `ok <page> ← <path>` — unchanged (whitespace-normalized) since the anchor SHA.
   - `STALE <page> ← <path> — changed in <short-sha> by <author> (<date>)` — content differs; author/commit come from `git log <sha>..HEAD -- <path>`.
   - `STALE <page> ← <path> — deleted since <sha>` — anchored file no longer exists.
   - `ERROR <page> — <reason>` — malformed anchor or missing/invalid `type` in frontmatter.
5. **Exits non-zero if any page is stale or errored**, zero otherwise — safe to gate CI or a pre-commit hook on the exit code alone.

## Mode B — prose health (on-demand, report-only, never gates)

```bash
node docs/wiki/lint/lint.js --prose
```

Reports, does not auto-fix:
- **Orphan pages** — any page other than `index.md`/`log.md` with no inbound `](./page.md)` link from another wiki page.
- **Broken cross-links** — a `](./file.md)` reference to a file that doesn't exist in `docs/wiki/`.
- **Missing/invalid frontmatter** — no `type` field.
- Prints a closing note that **contradiction detection** and **"concept mentioned but lacking a page" detection** are not automated here — they require semantic judgement a script can't reliably make. Do that check manually (or via an LLM agent read of the whole wiki) when it matters, e.g. before a release of the wiki itself.

Exits 0 always — this mode informs, it never blocks a build.

## Pre-commit hook snippet

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit (or wire via husky/lefthook)
if git diff --cached --name-only | grep -q '^docs/wiki/'; then
  node docs/wiki/lint/lint.js || {
    echo "docs/wiki has stale anchors — see output above. Re-verify and re-anchor before committing."
    exit 1
  }
fi
```

## CI snippet

```yaml
  wiki-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # anchors reference historical SHAs; shallow clones break `git show <sha>:<path>`
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
      - run: node docs/wiki/lint/lint.js
```

Add as its own job (parallel to `lint`/`test` in `.github/workflows/ci.yml`) rather than folding into an existing job, so a stale wiki page fails visibly and independently of the app's own lint/test/build.
