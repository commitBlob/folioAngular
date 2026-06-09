import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ExperienceProjectsComponent } from './experience-projects.component';

describe('ExperienceProjectsComponent', () => {
  let component: ExperienceProjectsComponent;
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    router = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [ExperienceProjectsComponent],
      providers: [{ provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(ExperienceProjectsComponent, '');

    component = TestBed.createComponent(ExperienceProjectsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filterProjects keeps only projects matching the company short name', () => {
    component.companyShortName = 'acme';
    component.projectsList = [
      { companyLink: 'acme', id: 1 },
      { companyLink: 'other', id: 2 },
      { companyLink: 'acme', id: 3 }
    ];

    component.filterProjects();

    expect(component.filteredProjects.length).toBe(2);
    expect(component.projectsFiltered).toBe(true);
    expect(component.hideAll).toBe(false);
  });

  it('filterProjects hides everything when there is no match', () => {
    component.companyShortName = 'acme';
    component.projectsList = [{ companyLink: 'other', id: 1 }];

    component.filterProjects();

    expect(component.filteredProjects.length).toBe(0);
    expect(component.hideAll).toBe(true);
  });

  it('goToProject navigates to the portfolio project route', () => {
    component.goToProject('p42');
    expect(router.navigate).toHaveBeenCalledWith(['/portfolio/p42']);
  });

  it('ngOnInit runs the filter', () => {
    component.companyShortName = 'acme';
    component.projectsList = [{ companyLink: 'acme', id: 1 }];
    component.ngOnInit();
    expect(component.projectsFiltered).toBe(true);
  });
});
