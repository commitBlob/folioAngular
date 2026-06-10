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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjectDetails returns only the item matching the given id', () => {
    const allItems = [{ id: 'abc' }, { id: 'xyz' }];
    service.getProjectDetails('abc').subscribe(res => expect(res).toEqual([{ id: 'abc' }]));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/project_details.json');
    expect(req.request.method).toBe('GET');
    req.flush(allItems);
  });

  it('getProjectDetails matches a numeric id against the string route param', () => {
    const allItems = [{ id: 8 }, { id: 9 }];
    service.getProjectDetails('8').subscribe(res => expect(res).toEqual([{ id: 8 }]));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/project_details.json');
    req.flush(allItems);
  });

  it('getProjectDetails returns an empty array when no item matches', () => {
    const allItems = [{ id: 8 }, { id: 9 }];
    service.getProjectDetails('99').subscribe(res => expect(res).toEqual([]));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/project_details.json');
    req.flush(allItems);
  });

  it('getProjectDetails surfaces errors through the catch handler', () => {
    let didError = false;
    service.getProjectDetails('abc').subscribe(null, () => didError = true);
    const req = httpMock.expectOne('./assets/data/projectdissimilar/project_details.json');
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
    expect(collect({ status: 404, statusText: 'Not Found' })).toBe('404 - Not Found');
    expect(collect({})).toBe('Server error');
  });
});
