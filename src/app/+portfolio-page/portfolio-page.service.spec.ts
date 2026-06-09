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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjects GETs ./assets/data/projectdissimilar/projects.json', () => {
    const data = [{ id: 'p1' }];
    service.getProjects().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/projects.json');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('getProjects surfaces errors through the catch handler', () => {
    let didError = false;
    service.getProjects().subscribe(null, () => didError = true);
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
    expect(collect({ status: 503, statusText: 'Unavailable' })).toBe('503 - Unavailable');
    expect(collect({})).toBe('Server error');
  });
});
