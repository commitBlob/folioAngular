import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { NavigationService } from './navigation.service';
import { GlobalNavigation } from './navigation-items';

describe('NavigationComponent', () => {
  let component: NavigationComponent;

  beforeEach(() => {
    const navServiceStub = { getNavigation: () => GlobalNavigation };

    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      providers: [{ provide: NavigationService, useValue: navServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(NavigationComponent, '');

    const fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit loads navigation elements from the service', () => {
    component.ngOnInit();
    expect(component.navigationElements).toBe(GlobalNavigation);
  });

  it('menuSelected emits the negated menu state', () => {
    const emitted: boolean[] = [];
    component.menuStateUpdated.subscribe((state: boolean) => emitted.push(state));

    component.menuOpen = false;
    component.menuSelected();
    component.menuOpen = true;
    component.menuSelected();

    expect(emitted).toEqual([true, false]);
  });
});
