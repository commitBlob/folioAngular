import { GlobalNavigation } from './navigation-items';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    service = new NavigationService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getNavigation returns the global navigation list', () => {
    expect(service.getNavigation()).toBe(GlobalNavigation);
    expect(service.getNavigation().length).toBe(GlobalNavigation.length);
  });
});
