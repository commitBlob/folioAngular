import * as Bowser from 'bowser';
import { BrowserDetectService } from './browser-detect.service';

describe('BrowserDetectService', () => {
  let service: BrowserDetectService;

  const stubParser = (name: string) => {
    jest.spyOn(Bowser, 'getParser').mockReturnValue({ getBrowserName: () => name } as any);
  };

  beforeEach(() => {
    service = new BrowserDetectService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns true for Chrome', () => {
    stubParser('Chrome');
    expect(service.chromeOrFirefoxCheck()).toBe(true);
  });

  it('returns true for Firefox', () => {
    stubParser('Firefox');
    expect(service.chromeOrFirefoxCheck()).toBe(true);
  });

  it('returns false for any other browser', () => {
    stubParser('Safari');
    expect(service.chromeOrFirefoxCheck()).toBe(false);
  });
});
