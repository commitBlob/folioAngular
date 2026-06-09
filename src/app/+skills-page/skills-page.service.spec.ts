import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SkillsPageService } from './skills-page.service';

describe('SkillsPageService', () => {
  let service: SkillsPageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkillsPageService]
    });
    service = TestBed.get(SkillsPageService);
    httpMock = TestBed.get(HttpTestingController);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSkillsList GETs ./assets/data/projectdissimilar/skills_list.json', () => {
    const data = [{ name: 'TypeScript' }];
    service.getSkillsList().subscribe(res => expect(res).toEqual(data as any));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/skills_list.json');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('getSkillsContent GETs ./assets/data/projectdissimilar/skills_content.json', () => {
    const data = [{ blurb: 'hi' }];
    service.getSkillsContent().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/skills_content.json');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('getSkillsList surfaces errors through the catch handler', () => {
    let didError = false;
    service.getSkillsList().subscribe(null, () => didError = true);
    const req = httpMock.expectOne('./assets/data/projectdissimilar/skills_list.json');
    req.error(new ErrorEvent('network error', { message: 'down' }));
    expect(didError).toBe(true);
  });

  it('handleError maps message, status and the server-error fallback', () => {
    const collect = (err: any): string => {
      let msg: string;
      (service as any).handleError(err).subscribe(null, (e: string) => (msg = e));
      return msg;
    };
    expect(collect({ message: 'boom' })).toBe('boom');
    expect(collect({ status: 400, statusText: 'Bad Request' })).toBe('400 - Bad Request');
    expect(collect({})).toBe('Server error');
  });
});
