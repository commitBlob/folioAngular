# folioAngular

[![CI](https://github.com/commitBlob/folioAngular/actions/workflows/ci.yml/badge.svg)](https://github.com/commitBlob/folioAngular/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/commitBlob/folioAngular)](https://github.com/commitBlob/folioAngular/releases)

Personal portfolio SPA built with Angular 5, live at <https://commitblob.github.io/folioAngular/>.

## Requirements

Node 10 (see `.nvmrc`) — the Angular 5 / node-sass toolchain does not build on newer Node versions.

```bash
nvm use
npm ci
```

## Development

```bash
npm start              # Dev server on port 8888
npm run lint           # TSLint
npm test               # Jest unit tests
npm run test:ci        # Jest with coverage (CI mode)
```

## Build

```bash
npm run build:prod     # Production build → dist/
npm run build:gh-pages # Production build with the GitHub Pages base href
```

## CI / Deployment

Every push and pull request to `master` runs the pipeline in
[`.github/workflows/ci.yml`](.github/workflows/ci.yml): lint and tests in
parallel, then a production build. On pushes to `master` the build is
deployed to GitHub Pages and a release is published automatically.

## Releases

Versioning is fully automated with
[semantic-release](https://github.com/semantic-release/semantic-release):
the version in `package.json`, the git tag, the GitHub Release, and
[`CHANGELOG.md`](CHANGELOG.md) are all derived from
[Conventional Commits](https://www.conventionalcommits.org/) on `master`:

| Commit message                          | Release  |
| --------------------------------------- | -------- |
| `fix: ...`                               | patch    |
| `feat: ...`                              | minor    |
| `feat!: ...` / `BREAKING CHANGE:` footer | major    |

Commits that don't follow the convention (or types like `chore:`, `docs:`,
`refactor:`) don't trigger a release on their own.

## Docker

```bash
docker build -t $imageName .       # Build and tag the image
docker run -p 80:80 $imageName     # Serve on port 80 via nginx
```
