import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectDetailsService } from './project-details.service';

describe('ProjectDetailsService', () => {
  let service: ProjectDetailsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectDetailsService]
    });
    service = TestBed.get(ProjectDetailsService);
    httpMock = TestBed.get(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjectDetails interpolates the project id into the URL', () => {
    const data = [{ id: 'abc' }];
    service.getProjectDetails('abc').subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./api/projectdetails/abc');
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
    expect(collect({ status: 404, statusText: 'Not Found' })).toBe('404 - Not Found');
    expect(collect({})).toBe('Server error');
  });
});
