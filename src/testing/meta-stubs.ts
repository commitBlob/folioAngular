// Shared jasmine stubs for the metadata plumbing reused by the page components.
// Lives outside the coverage scope (src/testing is not imported by production code).

export function metaSpy(): any {
  return jasmine.createSpyObj('Meta', ['addTag', 'addTags']);
}

export function titleSpy(): any {
  return jasmine.createSpyObj('Title', ['setTitle']);
}

export function metaTagsServiceStub(): any {
  return {
    setPageTitle: (page: string) => `TITLE | ${page}`,
    setDescriptionMetaTag: () => ({ name: 'description', content: 'desc' }),
    setMetaTag: (name: string, content: string) => ({ name, content }),
    setTwitterCard: () => ({ name: 'twitter:card', value: 'summary' }),
    setContentType: () => ({ httpEquiv: 'Content-Type', content: 'text/html', charset: 'utf-8' })
  };
}
