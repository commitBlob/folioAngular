import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserDetectService } from './shared/browser-detect/browser-detect.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let browserService: { chromeOrFirefoxCheck: jest.Mock };

  beforeEach(() => {
    browserService = { chromeOrFirefoxCheck: jest.fn() };
    browserService.chromeOrFirefoxCheck.mockReturnValue(true);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: BrowserDetectService, useValue: browserService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AppComponent, { set: { template: '', animations: [] } });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('sets browserSupported from the browser detect service', () => {
    expect(browserService.chromeOrFirefoxCheck).toHaveBeenCalled();
    expect(component.browserSupported).toBe(true);
  });

  it('toggleMenu flips the menu open state', () => {
    expect(component.menuOpen).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
    component.toggleMenu();
    expect(component.menuOpen).toBe(false);
  });

  it('updateMenuState assigns the given state', () => {
    component.updateMenuState(true);
    expect(component.menuOpen).toBe(true);
  });

  it('getRouteAnimation reads the activated route animation data', () => {
    const outlet = { activatedRouteData: { animation: 'about' } };
    expect(component.getRouteAnimation(outlet)).toBe('about');
  });
});
