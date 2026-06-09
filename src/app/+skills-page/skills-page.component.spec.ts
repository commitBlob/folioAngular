import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as moment from 'moment/moment';

import { SkillsPageComponent } from './skills-page.component';
import { SkillsPageService } from './skills-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { metaSpy, titleSpy, metaTagsServiceStub } from '../../testing/meta-stubs';

describe('SkillsPageComponent', () => {
  let component: SkillsPageComponent;
  let meta: any;
  let title: any;

  beforeEach(() => {
    meta = metaSpy();
    title = titleSpy();

    const skillsService = {
      getSkillsList: () => Observable.of([
        { name: 'a', 'font-awesome': true },
        { name: 'b' }
      ]),
      getSkillsContent: () => Observable.of([{ blurb: 'hi' }])
    };

    TestBed.configureTestingModule({
      declarations: [SkillsPageComponent],
      providers: [
        { provide: SkillsPageService, useValue: skillsService },
        { provide: Meta, useValue: meta },
        { provide: Title, useValue: title },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(SkillsPageComponent, '');

    component = TestBed.createComponent(SkillsPageComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('explodeSkillsList splits font-awesome from custom icons', () => {
    component.skills = [
      { name: 'a', 'font-awesome': true },
      { name: 'b' }
    ] as any;
    component.explodeSkillsList();
    expect(component.fontAwesomeList.length).toBe(1);
    expect(component.customIconsList.length).toBe(1);
  });

  it('convertMonths returns months under a year and rounded years above', () => {
    expect(component.convertMonths(6)).toBe('6 m');
    expect(component.convertMonths(18)).toBe('1.5 y');
  });

  it('calculateExperience reports months for recent dates', () => {
    const recent = moment().subtract(2, 'months').format('DD-MM-YYYY');
    expect(component.calculateExperience(recent)).toMatch(/ m$/);
  });

  it('calculateExperience reports years for old dates', () => {
    expect(component.calculateExperience('01-01-2000')).toMatch(/ y$/);
  });

  it('ngOnInit loads skills and skills content', () => {
    component.ngOnInit();
    expect(component.skills.length).toBe(2);
    expect(component.fontAwesomeList.length).toBe(1);
    expect(component.customIconsList.length).toBe(1);
    expect(component.skillsContent).toEqual({ blurb: 'hi' });
  });

  it('setMetaData sets the title, description and content type', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalledWith('TITLE | Skills');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'description', content: 'Skills Page' });
  });
});
