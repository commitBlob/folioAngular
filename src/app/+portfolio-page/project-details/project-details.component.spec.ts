import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ProjectDetailsComponent } from './project-details.component';
import { ProjectDetailsService } from './project-details.service';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let projectsService: { getProjectDetails: jest.Mock };
  let location: { back: jest.Mock };

  const gallery = [
    { image: 'i0', imageName: 'n0' },
    { image: 'i1', imageName: 'n1' },
    { image: 'i2', imageName: 'n2' }
  ];
  const details = [{
    skills: [{ name: 'a', 'font-awesome': true }, { name: 'b' }],
    gallery
  }];

  beforeEach(() => {
    projectsService = { getProjectDetails: jest.fn() };
    location = { back: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [ProjectDetailsComponent],
      providers: [
        { provide: ProjectDetailsService, useValue: projectsService },
        { provide: Location, useValue: location },
        { provide: ActivatedRoute, useValue: { params: Observable.of({ project: 'abc' }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(ProjectDetailsComponent, '');

    component = TestBed.createComponent(ProjectDetailsComponent).componentInstance;
  });

  it('reads the project id from the route params', () => {
    expect(component.projectId).toBe('abc');
  });

  it('imageSelected sets the active image, title and index', () => {
    component.galleryList = gallery;
    component.imageSelected(1);
    expect(component.activeImageIndex).toBe(1);
    expect(component.activeImage).toBe('i1');
    expect(component.activeImageTitle as any).toBe('n1');
  });

  it('setActiveImage sets the active image and title from a list', () => {
    component.setActiveImage(gallery, 2);
    expect(component.activeImage).toBe('i2');
    expect(component.activeImageTitle as any).toBe('n2');
  });

  it('previous moves back one image', () => {
    component.galleryList = gallery;
    component.activeImageIndex = 2;
    component.previous();
    expect(component.activeImageIndex).toBe(1);
    expect(component.activeImage).toBe('i1');
  });

  it('previous wraps to the last image from the first', () => {
    component.galleryList = gallery;
    component.activeImageIndex = 0;
    component.previous();
    expect(component.activeImageIndex).toBe(2);
    expect(component.activeImage).toBe('i2');
  });

  it('next moves forward one image', () => {
    component.galleryList = gallery;
    component.activeImageIndex = 0;
    component.next();
    expect(component.activeImageIndex).toBe(1);
    expect(component.activeImage).toBe('i1');
  });

  it('next wraps to the first image from the last', () => {
    component.galleryList = gallery;
    component.activeImageIndex = 2;
    component.next();
    expect(component.activeImageIndex).toBe(0);
    expect(component.activeImage).toBe('i0');
  });

  it('swipe right calls next and swipe left calls previous', () => {
    const next = jest.spyOn(component, 'next').mockImplementation(() => {});
    const previous = jest.spyOn(component, 'previous').mockImplementation(() => {});
    component.swipe('swiperight');
    expect(next).toHaveBeenCalled();
    component.swipe('swipeleft');
    expect(previous).toHaveBeenCalled();
  });

  it('explodeSkillsList splits font-awesome from custom icons', () => {
    component.skillsList = details[0].skills;
    component.explodeSkillsList();
    expect(component.fontAwesomeList.length).toBe(1);
    expect(component.customIconsList.length).toBe(1);
  });

  it('navigateBack goes back in history', () => {
    component.navigateBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('ngOnInit populates the project details when data is returned', () => {
    projectsService.getProjectDetails.mockReturnValue(Observable.of(details));
    component.ngOnInit();
    expect(component.projectDetails).toBe(details[0]);
    expect(component.skillsList).toBe(details[0].skills);
    expect(component.galleryList).toBe(gallery);
    expect(component.activeImage).toBe('i0');
    expect(component.activeImageIndex).toBe(0);
    expect(component.fontAwesomeList.length).toBe(1);
  });

  it('ngOnInit does nothing when no data is returned', () => {
    projectsService.getProjectDetails.mockReturnValue(Observable.of(null));
    component.ngOnInit();
    expect(component.projectDetails).toBeUndefined();
  });
});
