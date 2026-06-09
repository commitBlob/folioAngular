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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjectsList GETs ./assets/data/projectdissimilar/projects.json and wraps result as { payload }', () => {
    const raw = [{ ok: true }];
    service.getProjectsList().subscribe((res: any) => expect(res).toEqual({ payload: raw }));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/projects.json');
    expect(req.request.method).toBe('GET');
    req.flush(raw);
  });

  const cases: { method: keyof ExperiencePageService; url: string }[] = [
    { method: 'getPositions', url: './assets/data/projectdissimilar/positions.json' },
    { method: 'getEducation', url: './assets/data/projectdissimilar/education.json' }
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

  it('getProjectsList surfaces errors through the catch handler', () => {
    let didError = false;
    service.getProjectsList().subscribe(null, () => didError = true);
    const req = httpMock.expectOne('./assets/data/projectdissimilar/projects.json');
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
    expect(collect({ status: 500, statusText: 'Server Error' })).toBe('500 - Server Error');
    expect(collect({})).toBe('Server error');
  });
});
