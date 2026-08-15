#!/usr/bin/env node
'use strict';

/*
 * Staleness + prose-health linter for docs/wiki.
 * Zero dependencies — plain Node (works on Node 10 and Node 22).
 * See docs/wiki/lint/README.md for usage and CI wiring.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WIKI_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(WIKI_DIR, '..', '..');

function git(args) {
  return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' }).replace(/\r\n/g, '\n');
}

// Reads a file as utf8 and normalizes CRLF -> LF so every downstream regex
// and split('\n') in this file can assume a single, consistent line-ending
// convention. Without this, a CRLF checkout (e.g. Windows with
// core.autocrlf=true) breaks the frontmatter fence regex (`^---\n`), leaves
// a trailing \r on split lines, and generally makes anything anchored to
// `\n` line-ending-sensitive.
function readFileNormalized(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function listWikiPages() {
  return fs
    .readdirSync(WIKI_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(WIKI_DIR, f));
}

// --- minimal frontmatter parser -------------------------------------------
// Our frontmatter is a controlled, flat subset of YAML: `key: value` scalars
// and `key:` followed by `  - item` list entries. Good enough without a YAML
// dependency; anything fancier should switch to a real parser.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const lines = match[1].split('\n');
  const data = {};
  let currentKey = null;
  for (const line of lines) {
    const listItem = line.match(/^\s*-\s*(.+)$/);
    if (listItem && currentKey) {
      data[currentKey] = data[currentKey] || [];
      data[currentKey].push(listItem[1].trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value === '' ) {
        data[currentKey] = data[currentKey] || [];
      } else if (value === '[]') {
        data[currentKey] = [];
      } else {
        data[currentKey] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }
  return data;
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// path@sha  OR  path#Symbol@sha
function parseAnchor(anchor) {
  const at = anchor.lastIndexOf('@');
  if (at === -1) return null;
  const sha = anchor.slice(at + 1);
  const left = anchor.slice(0, at);
  const hash = left.indexOf('#');
  if (hash === -1) return { filePath: left, symbol: null, sha };
  return { filePath: left.slice(0, hash), symbol: left.slice(hash + 1), sha };
}

function fileAtSha(sha, filePath) {
  try {
    return git(['show', `${sha}:${filePath}`]);
  } catch (e) {
    return null; // file didn't exist at that sha, or sha unknown
  }
}

function currentFileContent(filePath) {
  const abs = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(abs)) return null;
  return readFileNormalized(abs);
}

function lastCommitTouching(sha, filePath) {
  try {
    const out = git([
      'log',
      '-1',
      '--format=%h|%an|%ad',
      '--date=short',
      `${sha}..HEAD`,
      '--',
      filePath
    ]).trim();
    if (!out) return null;
    const [commit, author, date] = out.split('|');
    return { commit, author, date };
  } catch (e) {
    return null;
  }
}

// --- Mode A: git staleness --------------------------------------------------
function runStaleness() {
  const pages = listWikiPages();
  let anyStale = false;
  const results = [];

  for (const pagePath of pages) {
    const raw = readFileNormalized(pagePath);
    const fm = parseFrontmatter(raw);
    const pageName = path.relative(WIKI_DIR, pagePath);

    if (!fm || !fm.type) {
      results.push({ page: pageName, status: 'ERROR', detail: 'missing or invalid frontmatter (no `type`)' });
      anyStale = true;
      continue;
    }

    const anchors = fm.anchors || [];
    if (anchors.length === 0) {
      results.push({ page: pageName, status: 'ok', detail: '(no anchors — Index/Log page)' });
      continue;
    }

    for (const rawAnchor of anchors) {
      const parsed = parseAnchor(rawAnchor);
      if (!parsed) {
        results.push({ page: pageName, status: 'ERROR', detail: `malformed anchor "${rawAnchor}"` });
        anyStale = true;
        continue;
      }

      const { filePath, symbol, sha } = parsed;
      const oldContent = fileAtSha(sha, filePath);
      const newContent = currentFileContent(filePath);

      if (oldContent === null) {
        results.push({ page: pageName, status: 'STALE', detail: `${filePath}@${sha} — anchor sha/path not resolvable via git show` });
        anyStale = true;
        continue;
      }
      if (newContent === null) {
        results.push({ page: pageName, status: 'STALE', detail: `${filePath} — deleted since ${sha}` });
        anyStale = true;
        continue;
      }

      let oldBody = oldContent;
      let newBody = newContent;
      let symbolNote = '';
      if (symbol) {
        symbolNote = ' (symbol granularity unavailable — file-level check)';
      }

      if (normalizeWhitespace(oldBody) === normalizeWhitespace(newBody)) {
        results.push({ page: pageName, status: 'ok', detail: `${filePath}${symbol ? '#' + symbol : ''}${symbolNote}` });
        continue;
      }

      const commitInfo = lastCommitTouching(sha, filePath);
      const who = commitInfo
        ? `changed in ${commitInfo.commit} by ${commitInfo.author} (${commitInfo.date})`
        : 'changed since anchor sha (commit info unavailable)';
      results.push({
        page: pageName,
        status: 'STALE',
        detail: `${filePath}${symbol ? '#' + symbol : ''}${symbolNote} — ${who}`
      });
      anyStale = true;
    }
  }

  for (const r of results) {
    if (r.status === 'ok') {
      console.log(`ok ${r.page} ← ${r.detail}`);
    } else if (r.status === 'STALE') {
      console.log(`STALE ${r.page} ← ${r.detail}`);
    } else {
      console.log(`ERROR ${r.page} — ${r.detail}`);
    }
  }

  return anyStale ? 1 : 0;
}

// --- Mode B: prose health (report-only) -------------------------------------
function runProse() {
  const pages = listWikiPages();
  const pageMeta = pages.map((p) => {
    const raw = readFileNormalized(p);
    return { file: p, name: path.basename(p), raw, fm: parseFrontmatter(raw) };
  });

  let issues = 0;

  // Broken frontmatter
  for (const p of pageMeta) {
    if (!p.fm || !p.fm.type) {
      console.log(`ISSUE ${p.name}: missing or invalid frontmatter (no \`type\`)`);
      issues++;
    }
  }

  // Cross-links: ](./file.md) style relative links within docs/wiki
  const linkRe = /\]\(\.\/([A-Za-z0-9_\-./]+\.md)(#[^)]*)?\)/g;
  const inbound = {};
  for (const p of pageMeta) inbound[p.name] = 0;

  for (const p of pageMeta) {
    let m;
    linkRe.lastIndex = 0;
    while ((m = linkRe.exec(p.raw))) {
      const target = m[1];
      const targetPath = path.join(WIKI_DIR, target);
      if (!fs.existsSync(targetPath)) {
        console.log(`ISSUE ${p.name}: broken cross-link → ./${target}`);
        issues++;
        continue;
      }
      inbound[target] = (inbound[target] || 0) + 1;
    }
  }

  // Orphan pages: no inbound links, excluding index.md/log.md which are entry points
  for (const p of pageMeta) {
    if (p.name === 'index.md' || p.name === 'log.md') continue;
    if (!inbound[p.name]) {
      console.log(`ISSUE ${p.name}: orphan page — no inbound link from index.md or another wiki page`);
      issues++;
    }
  }

  if (issues === 0) {
    console.log('prose-health: no issues found (orphans, broken links, missing frontmatter)');
  }
  console.log(
    '\nNote: contradiction detection and "concept mentioned but lacking a page" detection are not ' +
      'automated by this script — they require semantic judgement. Review new pages manually against ' +
      'this list when running --prose.'
  );

  return 0; // prose mode is report-only, never gates a build
}

// --- entrypoint --------------------------------------------------------------
function main() {
  const mode = process.argv.includes('--prose') ? 'prose' : 'staleness';
  const exitCode = mode === 'prose' ? runProse() : runStaleness();
  process.exit(exitCode);
}

main();
