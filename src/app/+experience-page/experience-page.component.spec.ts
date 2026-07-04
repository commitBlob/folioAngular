import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ExperiencePageComponent } from './experience-page.component';
import { ExperiencePageService } from './experience-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { metaSpy, titleSpy, metaTagsServiceStub } from '../../testing/meta-stubs';

describe('ExperiencePageComponent', () => {
  let component: ExperiencePageComponent;
  let meta: any;
  let title: any;

  const progressionFixture = {
    employer: 'Version 1',
    roles: [
      { title: 'Role A', period: '2021 -', active: true, engagements: [{ name: 'Client', companyLink: 'v1client' }] }
    ]
  };

  beforeEach(() => {
    const experienceService = {
      getProjectsList: () => Observable.of({ payload: ['p1'] }),
      getPositions: () => Observable.of(['pos1']),
      getEducation: () => Observable.of(['edu1']),
      getCareerProgression: () => Observable.of(progressionFixture)
    };
    meta = metaSpy();
    title = titleSpy();

    TestBed.configureTestingModule({
      declarations: [ExperiencePageComponent],
      providers: [
        { provide: ExperiencePageService, useValue: experienceService },
        { provide: Meta, useValue: meta },
        { provide: Title, useValue: title },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(ExperiencePageComponent, '');

    component = TestBed.createComponent(ExperiencePageComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generateImage prefixes the base64 png header', () => {
    expect(component.generateImage('ABC')).toBe('data:image/png;base64,ABC');
  });

  it('generatePeriod appends Present for current roles', () => {
    expect(component.generatePeriod(true, '2020 -')).toBe('<p>2020 - Present</p>');
    expect(component.generatePeriod(false, '2018 - 2020')).toBe('<p>2018 - 2020</p>');
  });

  it('ngOnInit populates projects, positions, education and career progression', () => {
    component.ngOnInit();
    expect(component.projectsList).toEqual(['p1']);
    expect(component.positions).toEqual(['pos1']);
    expect(component.education).toEqual(['edu1']);
    expect(component.careerProgression).toEqual(progressionFixture);
  });

  it('showTimeline is true only for company links present in the progression roles', () => {
    component.ngOnInit();
    expect(component.showTimeline('v1client')).toBe(true);
    expect(component.showTimeline('other')).toBe(false);
  });

  it('showTimeline is false before the progression data loads', () => {
    expect(component.showTimeline('v1client')).toBe(false);
  });

  it('scrollToPosition scrolls to the matching card and highlights it temporarily', () => {
    jest.useFakeTimers();
    const scrollIntoView = jest.fn();
    component.positionCards = [
      { nativeElement: { getAttribute: () => 'v1client', scrollIntoView } }
    ] as any;

    component.scrollToPosition('v1client');

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(component.highlightedCompanyLink).toBe('v1client');
    jest.runAllTimers();
    expect(component.highlightedCompanyLink).toBe('');
    jest.useRealTimers();
  });

  it('scrollToPosition does nothing when no card matches', () => {
    component.positionCards = [
      { nativeElement: { getAttribute: () => 'other', scrollIntoView: jest.fn() } }
    ] as any;

    component.scrollToPosition('v1client');

    expect(component.highlightedCompanyLink).toBe('');
  });

  it('setMetaData sets the title, description and content type', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalledWith('TITLE | Experience');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'description', content: 'Experience Page' });
  });
});
