import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CareerTimelineComponent } from './career-timeline.component';

describe('CareerTimelineComponent', () => {
  let component: CareerTimelineComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerTimelineComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(CareerTimelineComponent, '');

    component = TestBed.createComponent(CareerTimelineComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isCurrentCard is true when an engagement matches the current company link', () => {
    component.currentCompanyLink = 'cafcass';
    const role = { engagements: [{ companyLink: 'cafcass' }, { companyLink: 'dsit' }] };
    expect(component.isCurrentCard(role)).toBe(true);
  });

  it('isCurrentCard is false when no engagement matches', () => {
    component.currentCompanyLink = 'hmcts';
    const role = { engagements: [{ companyLink: 'dsit' }] };
    expect(component.isCurrentCard(role)).toBe(false);
  });

  it('selectEngagement emits the company link', () => {
    const emitted: string[] = [];
    component.engagementSelected.subscribe((link: string) => emitted.push(link));
    component.selectEngagement('dsit');
    expect(emitted).toEqual(['dsit']);
  });
});
