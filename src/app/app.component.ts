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

  constructor() {}

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
