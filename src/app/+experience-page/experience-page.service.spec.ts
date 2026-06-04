import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExperiencePageService } from './experience-page.service';

describe('ExperiencePageService', () => {
  let service: ExperiencePageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExperiencePageService]
    });
    service = TestBed.get(ExperiencePageService);
    httpMock = TestBed.get(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const cases: { method: keyof ExperiencePageService; url: string }[] = [
    { method: 'getProjectsList', url: './api/projectslist' },
    { method: 'getPositions', url: './api/positions' },
    { method: 'getEducation', url: './api/education' }
  ];

  cases.forEach(({ method, url }) => {
    it(`${method} GETs ${url}`, () => {
      const data = [{ ok: true }];
      (service[method] as any)().subscribe((res: any) => expect(res).toEqual(data));
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  it('handleError maps message, status and the server-error fallback', () => {
    const collect = (err: any): string => {
      let msg: string;
      (service as any).handleError(err).subscribe(null, (e: string) => (msg = e));
      return msg;
    };
    expect(collect({ message: 'boom' })).toBe('boom');
    expect(collect({ status: 500, statusText: 'Server Error' })).toBe('500 - Server Error');
    expect(collect({})).toBe('Server error');
  });
});
