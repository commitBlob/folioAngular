import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactPageService } from './contact-page.service';

describe('ContactPageService', () => {
  let service: ContactPageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactPageService]
    });
    service = TestBed.get(ContactPageService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('submitForm POSTs JSON to ./api/notify with a JSON content-type header', () => {
    const body = { name: 'Ada', email: 'ada@example.com', message: 'hi' };
    service.submitForm(body).subscribe(res => expect(res).toEqual({ ok: true }));

    const req = httpMock.expectOne('./api/notify');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toBe(JSON.stringify(body));
    req.flush({ ok: true });
  });
});
