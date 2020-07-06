// Core
import { Injectable } from '@angular/core';
import * as Bowser from 'bowser';

@Injectable()
export class BrowserDetectService {

  chromeOrFirefoxCheck(): boolean {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();

    return (browserName === 'Chrome' || browserName === 'Firefox');
  }
}
