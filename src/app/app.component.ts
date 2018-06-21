// Core
import { Component } from '@angular/core';

// App specific
import { routerAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [routerAnimation]
})
export class AppComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  constructor() {}

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
}
