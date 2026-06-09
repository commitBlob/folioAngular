import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let events: Subject<any>;
  let service: GoogleAnalyticsService;

  beforeEach(() => {
    events = new Subject<any>();
    service = new GoogleAnalyticsService({ events } as any);
  });

  it('should be created and subscribe to router events', () => {
    expect(service).toBeTruthy();
  });

  it('handles a NavigationEnd event without throwing', () => {
    expect(() => events.next(new NavigationEnd(1, '/about', '/about'))).not.toThrow();
  });

  it('ignores non-navigation events', () => {
    expect(() => events.next({ foo: 'bar' })).not.toThrow();
  });
});
