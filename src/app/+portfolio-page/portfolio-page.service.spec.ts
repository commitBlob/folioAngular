import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PortfolioPageService } from './portfolio-page.service';

describe('PortfolioPageService', () => {
  let service: PortfolioPageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioPageService]
    });
    service = TestBed.get(PortfolioPageService);
    httpMock = TestBed.get(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjects GETs ./api/allprojects', () => {
    const data = [{ id: 'p1' }];
    service.getProjects().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./api/allprojects');
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
    expect(collect({ status: 503, statusText: 'Unavailable' })).toBe('503 - Unavailable');
    expect(collect({})).toBe('Server error');
  });
});
