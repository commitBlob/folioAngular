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

  it('activeProjects filters out inactive projects', () => {
    component.projectsList = [
      { id: 'p1', active: true },
      { id: 'p2', active: false },
      { id: 'p3', active: true }
    ];
    expect(component.activeProjects).toEqual([
      { id: 'p1', active: true },
      { id: 'p3', active: true }
    ]);
  });

  it('activeProjects returns empty array when no projects are active', () => {
    component.projectsList = [{ id: 'p1', active: false }];
    expect(component.activeProjects).toEqual([]);
  });

  it('setMetaData sets the title, description and content type', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalledWith('TITLE | Projects List');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'description', content: 'Projects List Page' });
  });
});

describe('PortfolioPageComponent (rendered template)', () => {
  const projectsFixture = [
    { projectId: 3, name: 'Some Project', mainImage: 'XYZ', active: true },
    { projectId: 7, name: 'Portfolio Migration', mainImage: 'ABC', active: true },
    { projectId: 9, name: 'Inactive Project', mainImage: 'DEF', active: false }
  ];

  let fixture;

  beforeEach(() => {
    const router = { navigate: jest.fn() };
    const portfolioService = { getProjects: () => Observable.of(projectsFixture) };

    TestBed.configureTestingModule({
      declarations: [PortfolioPageComponent],
      providers: [
        { provide: PortfolioPageService, useValue: portfolioService },
        { provide: Router, useValue: router },
        { provide: Meta, useValue: metaSpy() },
        { provide: Title, useValue: titleSpy() },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ]
    });

    fixture = TestBed.createComponent(PortfolioPageComponent);
    fixture.detectChanges();
  });

  const activeProjectsFixture = projectsFixture.filter((project) => project.active);

  it('sets each image alt attribute to the project name, not project.projectName', () => {
    const images: NodeListOf<HTMLImageElement> = fixture.nativeElement.querySelectorAll('img');

    expect(images.length).toBe(activeProjectsFixture.length);
    images.forEach((img, index) => {
      expect(img.alt).toBe(activeProjectsFixture[index].name);
      expect(img.alt).not.toBe('project.projectName');
    });
  });

  it('sets the alt attribute of the Portfolio Migration project (id 7) correctly', () => {
    const images: NodeListOf<HTMLImageElement> = fixture.nativeElement.querySelectorAll('img');
    const portfolioMigrationImage = images[activeProjectsFixture.findIndex((project) => project.projectId === 7)];

    expect(portfolioMigrationImage.alt).toBe('Portfolio Migration');
  });

  it('does not render inactive projects', () => {
    const images: NodeListOf<HTMLImageElement> = fixture.nativeElement.querySelectorAll('img');
    const inactiveAlts = Array.from(images).map((img) => img.alt);

    expect(inactiveAlts).not.toContain('Inactive Project');
  });
});
