import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AboutPageComponent } from './about-page.component';
import { AboutPageService } from './about-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { metaSpy, titleSpy, metaTagsServiceStub } from '../../testing/meta-stubs';

describe('AboutPageComponent', () => {
  let component: AboutPageComponent;
  let aboutService: any;
  let router: { navigate: jest.Mock };
  let meta: any;
  let title: any;

  beforeEach(() => {
    aboutService = {
      getImages: () => Observable.of(['pic1', 'pic2']),
      getSocialIcons: () => Observable.of(['twitter'])
    };
    router = { navigate: jest.fn() };
    meta = metaSpy();
    title = titleSpy();

    TestBed.configureTestingModule({
      declarations: [AboutPageComponent],
      providers: [
        { provide: AboutPageService, useValue: aboutService },
        { provide: Router, useValue: router },
        { provide: Meta, useValue: meta },
        { provide: Title, useValue: title },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(AboutPageComponent, '');

    component = TestBed.createComponent(AboutPageComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bounceImage toggles the bouncer class on mouseover and out', () => {
    component.bounceImage({ type: 'mouseover' });
    expect(component.bouncer).toBe('bounce-out');
    component.bounceImage({ type: 'mouseout' });
    expect(component.bouncer).toBe('no-bounce');
  });

  it('generateImage prefixes the base64 jpeg header', () => {
    expect(component.generateImage('XYZ')).toBe('data:image/jpeg;base64,XYZ');
  });

  it('doNavigate routes to the given path', () => {
    component.doNavigate('skills');
    expect(router.navigate).toHaveBeenCalledWith(['skills']);
  });

  it('calculateAge produces a positive number of years', () => {
    component.calculateAge();
    expect(component.age).toBeGreaterThan(0);
    expect(component.age).toBeLessThan(60);
  });

  it('ngOnInit loads pictures and icons and clears the loading flag', () => {
    component.ngOnInit();
    expect(component.profilePictures).toEqual(['pic1', 'pic2']);
    expect(component.socialIcons).toEqual(['twitter']);
    expect(component.isLoading).toBe(false);
  });

  it('setMetaData wires up title, description, og and twitter tags', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalledWith('TITLE | About');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'description', content: 'desc' });
    expect(meta.addTags).toHaveBeenCalled();
  });
});
