import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { ContactPageComponent } from './contact-page.component';
import { ContactPageService } from './contact-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { metaSpy, titleSpy, metaTagsServiceStub } from '../../testing/meta-stubs';

describe('ContactPageComponent', () => {
  let component: ContactPageComponent;
  let contactService: { submitForm: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    contactService = { submitForm: jest.fn() };
    router = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ContactPageComponent],
      providers: [
        { provide: ContactPageService, useValue: contactService },
        { provide: Router, useValue: router },
        { provide: Meta, useValue: metaSpy() },
        { provide: Title, useValue: titleSpy() },
        { provide: MetaTagsService, useValue: metaTagsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideTemplate(ContactPageComponent, '');

    component = TestBed.createComponent(ContactPageComponent).componentInstance;
    component.ngOnInit();
  });

  it('should create and build the contact form', () => {
    expect(component).toBeTruthy();
    expect(component.contactForm.contains('name')).toBe(true);
    expect(component.contactForm.contains('email')).toBe(true);
    expect(component.contactForm.contains('message')).toBe(true);
  });

  it('checkName flags a touched, empty name', () => {
    component.contactForm.controls['name'].markAsTouched();
    expect(component.checkName()).toBeTruthy();
  });

  it('checkMessage flags a touched, empty message', () => {
    component.contactForm.controls['message'].markAsTouched();
    expect(component.checkMessage()).toBeTruthy();
  });

  it('checkEmail reports an invalid email format', () => {
    component.contactForm.controls['email'].setValue('not-an-email');
    component.checkEmail();
    expect(component.emailError).toBe('Email format seems to be invalid');
  });

  it('checkEmail reports a missing email', () => {
    component.contactForm.controls['email'].setValue('');
    component.checkEmail();
    expect(component.emailError).toBe('Please insert your email address');
  });

  it('checkEmail clears the error for a valid email', () => {
    component.contactForm.controls['email'].setValue('ada@example.com');
    component.checkEmail();
    expect(component.emailError).toBe('');
  });

  it('doCheckEmail returns truthy when the touched email is invalid', () => {
    component.contactForm.controls['email'].setValue('bad');
    component.contactForm.controls['email'].markAsTouched();
    expect(component.doCheckEmail()).toBeTruthy();
  });

  it('submitForm posts the form and records a successful response', () => {
    contactService.submitForm.mockReturnValue(Observable.of({ status: 'ok' }));
    component.contactForm.setValue({ name: 'Ada', email: 'ada@example.com', message: 'hello' });

    component.submitForm();

    expect(component.animateMe).toBe(true);
    expect(contactService.submitForm).toHaveBeenCalled();
    expect(component.responsePayload).toEqual({ status: 'ok' });
    expect(component.formSent).toBe(true);
  });

  it('submitForm records an error response', () => {
    contactService.submitForm.mockReturnValue(Observable.throw('boom'));
    component.contactForm.setValue({ name: 'Ada', email: 'ada@example.com', message: 'hello' });

    component.submitForm();

    expect(component.responsePayload).toBe('boom');
    expect(component.formSent).toBe(true);
  });

  it('submitForm does nothing when the form is invalid', () => {
    component.submitForm();
    expect(contactService.submitForm).not.toHaveBeenCalled();
  });

  it('goBackHome navigates to /about', () => {
    component.goBackHome();
    expect(router.navigate).toHaveBeenCalledWith(['/about']);
  });

  it('debounced email changes trigger validation after 800ms', fakeAsync(() => {
    const spy = jest.spyOn(component, 'doCheckEmail');
    component.contactForm.controls['email'].setValue('bad');
    tick(800);
    expect(spy).toHaveBeenCalled();
  }));
});
