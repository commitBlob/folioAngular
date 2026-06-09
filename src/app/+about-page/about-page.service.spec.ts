import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  let service: AboutPageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AboutPageService]
    });
    service = TestBed.get(AboutPageService);
    httpMock = TestBed.get(HttpTestingController);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getImages GETs ./assets/data/projectdissimilar/profile_pictures.json', () => {
    const data = [{ id: 1 }];
    service.getImages().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/profile_pictures.json');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('getSocialIcons GETs ./assets/data/projectdissimilar/social_icons.json', () => {
    const data = [{ id: 2 }];
    service.getSocialIcons().subscribe(res => expect(res).toEqual(data));
    const req = httpMock.expectOne('./assets/data/projectdissimilar/social_icons.json');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('getImages surfaces errors through the catch handler', () => {
    let didError = false;
    service.getImages().subscribe(null, () => didError = true);
    const req = httpMock.expectOne('./assets/data/projectdissimilar/profile_pictures.json');
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
