import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PortfolioPageComponent } from './portfolio-page.component';
import { PortfolioPageService } from './portfolio-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { metaSpy, titleSpy, metaTagsServiceStub } from '../../testing/meta-stubs';

describe('PortfolioPageComponent', () => {
  let component: PortfolioPageComponent;
  let router: { navigate: jest.Mock };
  let meta: any;
  let title: any;

  beforeEach(() => {
    router = { navigate: jest.fn() };
    meta = metaSpy();
    title = titleSpy();

    const portfolioService = { getProjects: () => Observable.of([{ id: 'p1' }, { id: 'p2' }]) };

    TestBed.configureTestingModule({
      declarations: [PortfolioPageComponent],
      providers: [
        { provide: PortfolioPageService, useValue: portfolioService },
        { provide: Router, useValue: router },
        { provide: Meta, useValue: meta },
        { provide: Title, useValue: title },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(PortfolioPageComponent, '');

    component = TestBed.createComponent(PortfolioPageComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generateImage prefixes the base64 jpeg header', () => {
    expect(component.generateImage('ABC')).toBe('data:image/jpeg;base64,ABC');
  });

  it('goToProject navigates to the project route', () => {
    component.goToProject('p1');
    expect(router.navigate).toHaveBeenCalledWith(['portfolio/p1']);
  });

  it('ngOnInit loads the projects list', () => {
    component.ngOnInit();
    expect(component.projectsList).toEqual([{ id: 'p1' }, { id: 'p2' }]);
  });

  it('setMetaData sets the title, description and content type', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalledWith('TITLE | Projects List');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'description', content: 'Projects List Page' });
  });
});
