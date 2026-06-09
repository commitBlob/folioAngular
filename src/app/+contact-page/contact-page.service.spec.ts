import { ContactPageService } from './contact-page.service';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(() => {
    service = new ContactPageService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('submitForm returns an observable that emits null', () => {
    const body = { name: 'Ada', email: 'ada@example.com', message: 'hi' };
    let result: any;
    service.submitForm(body).subscribe(res => (result = res));
    expect(result).toBeNull();
  });
});
