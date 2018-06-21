// Core
import { Injectable } from '@angular/core';

// App specific
import { GlobalNavigation } from './navigation-items';

@Injectable()
export class NavigationService {
  getNavigation() {
    return GlobalNavigation;
  }
}
