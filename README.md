# folioAngular

[![CI](https://github.com/commitBlob/folioAngular/actions/workflows/ci.yml/badge.svg)](https://github.com/commitBlob/folioAngular/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/commitBlob/folioAngular)](https://github.com/commitBlob/folioAngular/releases)

Personal portfolio SPA of Maro Radovic, built with Angular 5 (Angular CLI 1.7.3). All content is served from static JSON files in `src/assets/data/` — there is no backend. Live at <https://commitblob.github.io/folioAngular/>.

## Development

```bash
npm start              # Dev server on port 8888
npm run build          # Dev build → dist/
npm run build:prod     # Production build → dist/
npm run build:gh-pages # Production build with /folioAngular/ base href (used by CI)
npm test               # Jest unit tests
npm run test:watch     # Jest in watch mode
npm run lint           # TSLint
```

Node 10 required (see `.nvmrc`) — node-sass 4.x doesn't build on newer versions. Run `nvm use` before `npm ci`.

## Releases

Versioning is fully automated with
[semantic-release](https://github.com/semantic-release/semantic-release) on every push to `master`.
Use [Conventional Commits](https://www.conventionalcommits.org/):

| Commit message                           | Release |
| ---------------------------------------- | ------- |
| `fix: ...`                               | patch   |
| `feat: ...`                              | minor   |
| `feat!: ...` / `BREAKING CHANGE:` footer | major   |

Other types (`chore:`, `docs:`, `refactor:`) don't trigger a release.

## Docker

```bash
docker build -t $imageName .   # Build image
docker run -p 80:80 $imageName # Serve on port 80 via nginx
```
