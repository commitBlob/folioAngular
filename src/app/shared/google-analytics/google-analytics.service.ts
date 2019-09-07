import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare var ga: Function;

@Injectable()
export class GoogleAnalyticsService {

  constructor(private router: Router) {
    router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        // ga('set', 'page', event.url);
        // ga('send', 'pageview');
      }
    });
  }
}
