import { MetaTagsService } from './meta-tags.service';

describe('MetaTagsService', () => {
  let service: MetaTagsService;

  beforeEach(() => {
    service = new MetaTagsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setPageTitle composes name, role and page', () => {
    expect(service.setPageTitle('About'))
      .toBe('Maro Radovic - Senior Software Developer & Research Lead | About');
  });

  it('setDescriptionMetaTag returns a description tag', () => {
    const tag = service.setDescriptionMetaTag();
    expect(tag.name).toBe('description');
    expect(tag.content).toContain('Maro Radovic');
    expect(tag.content).toContain('Ntegra');
  });

  it('setMetaTag returns the given name/content pair', () => {
    expect(service.setMetaTag('og:title', 'Hello')).toEqual({ name: 'og:title', content: 'Hello' });
  });

  it('setTwitterCard returns a summary card', () => {
    expect(service.setTwitterCard()).toEqual({ name: 'twitter:card', value: 'summary' });
  });

  it('setContentType returns the content-type meta', () => {
    expect(service.setContentType())
      .toEqual({ httpEquiv: 'Content-Type', content: 'text/html', charset: 'uft-8' });
  });
});
