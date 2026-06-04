import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FaqsPageService } from './faqs-page.service';

describe('FaqsPageService', () => {
  let service: FaqsPageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FaqsPageService]
    });
    service = TestBed.get(FaqsPageService);
    httpMock = TestBed.get(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFaqs GETs the local faqs_list.json asset', () => {
    const data = [{ q: 'why', a: 'because' }];
    service.getFaqs().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/faqs_list.json');
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
