import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserUnsupportedComponent } from './browser-unsupported.component';

describe('BrowserUnsupportedComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrowserUnsupportedComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(BrowserUnsupportedComponent, '');
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BrowserUnsupportedComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
