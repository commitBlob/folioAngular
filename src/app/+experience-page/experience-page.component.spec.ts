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

  beforeEach(() => {
    const experienceService = {
      getProjectsList: () => Observable.of({ payload: ['p1'] }),
      getPositions: () => Observable.of(['pos1']),
      getEducation: () => Observable.of(['edu1'])
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

  it('ngOnInit populates projects, positions and education', () => {
    component.ngOnInit();
    expect(component.projectsList).toEqual(['p1']);
    expect(component.positions).toEqual(['pos1']);
    expect(component.education).toEqual(['edu1']);
  });

  it('setMetaData sets the title, description and content type', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalled();
    expect(meta.addTag).toHaveBeenCalled();
  });
});
