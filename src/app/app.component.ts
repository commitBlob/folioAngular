// Core
import { Component } from '@angular/core';

// App specific
import { BrowserDetectService } from './shared/browser-detect/browser-detect.service';
import { routerAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [routerAnimation]
})
export class AppComponent {
  menuOpen = false;
  browserSupported: boolean;

  constructor(private browserService: BrowserDetectService) {
    this.browserSupported = browserService.chromeOrFirefoxCheck();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  updateMenuState(menuState) {
    this.menuOpen = menuState;
  }

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
}
