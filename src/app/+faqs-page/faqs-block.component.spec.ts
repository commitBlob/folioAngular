import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { FaqsBlockComponent } from './faqs-block.component';
import { FaqsPageService } from './faqs-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { metaSpy, titleSpy, metaTagsServiceStub } from '../../testing/meta-stubs';

describe('FaqsBlockComponent', () => {
  let component: FaqsBlockComponent;
  let location: { back: jest.Mock };
  let meta: any;
  let title: any;

  beforeEach(() => {
    location = { back: jest.fn() };
    meta = metaSpy();
    title = titleSpy();

    const faqsService = { getFaqs: () => Observable.of([{ q: 'why', a: 'because' }]) };

    TestBed.configureTestingModule({
      declarations: [FaqsBlockComponent],
      providers: [
        { provide: FaqsPageService, useValue: faqsService },
        { provide: Location, useValue: location },
        { provide: Meta, useValue: meta },
        { provide: Title, useValue: title },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(FaqsBlockComponent, '');

    component = TestBed.createComponent(FaqsBlockComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigateBack clears the faqs and goes back', () => {
    component.faqs = [{ q: 'x' }];
    component.navigateBack();
    expect(component.faqs).toEqual([]);
    expect(location.back).toHaveBeenCalled();
  });

  it('ngOnInit loads faqs after the delay fires', fakeAsync(() => {
    component.ngOnInit();
    expect(component.faqs).toEqual([]);
    tick(500);
    expect(component.faqs).toEqual([{ q: 'why', a: 'because' }]);
  }));

  it('setMetaData sets the title, description and content type', () => {
    component.setMetaData();
    expect(title.setTitle).toHaveBeenCalledWith('TITLE | FAQs');
    expect(meta.addTag).toHaveBeenCalledWith({ name: 'description', content: 'FAQs Page' });
  });
});
