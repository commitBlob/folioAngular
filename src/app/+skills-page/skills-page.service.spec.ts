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
    spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSkillsList GETs ./api/skills', () => {
    const data = [{ name: 'TypeScript' }];
    service.getSkillsList().subscribe(res => expect(res).toEqual(data as any));
    const req = httpMock.expectOne('./api/skills');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('getSkillsContent GETs ./api/skillscontent', () => {
    const data = [{ blurb: 'hi' }];
    service.getSkillsContent().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./api/skillscontent');
    expect(req.request.method).toBe('GET');
    req.flush(data);
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
