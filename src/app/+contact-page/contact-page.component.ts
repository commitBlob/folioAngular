// Core
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import 'rxjs/add/operator/debounceTime';

// App specific
import { ContactPageService } from './contact-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';

@Component({
  selector: 'folio-contact',
  templateUrl: 'contact-page.component.html',
})
export class ContactPageComponent implements OnInit {

  contactForm: FormGroup;
  pageName = 'Contact Me';

  animateMe = false;
  formSent = false;
  responsePayload;

  emailError = '';

  constructor(private formBuilder: FormBuilder,
              private contactService: ContactPageService,
              private router: Router,
              private title: Title,
              private meta: Meta,
              private metaTagsService: MetaTagsService) {
  }

  checkName() {
    return (this.contactForm.controls['name'].errors && !this.contactForm.controls['name'].untouched);
  }

  doCheckEmail() {
    this.emailError = 'Please insert your email address';
    this.checkEmail();
    return (this.contactForm.controls['email'].errors && !this.contactForm.controls['email'].untouched);
  }

  checkEmail() {
    if (this.contactForm.controls.email.status !== 'VALID' && this.contactForm.controls.email.errors.email) {
      this.emailError = 'Email format seems to be invalid';
    }

    if (this.contactForm.controls.email.status !== 'VALID' &&  this.contactForm.controls.email.errors.required) {
      this.emailError = 'Please insert your email address';
    }

    if (this.contactForm.controls.email.status === 'VALID') {
      this.emailError = '';
    }
  }

  checkMessage() {
    return (this.contactForm.controls['message'].errors && !this.contactForm.controls['message'].untouched);
  }

  submitForm() {
    if (this.contactForm.valid) {
      const contactFormBody = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message
      };

      this.animateMe = true;

      this.contactService.submitForm(contactFormBody).subscribe(
        (res) => {
          this.responsePayload = res;
          this.formSent = true;
        },
        (error) => {
          this.responsePayload = error;
          this.formSent = true;
        }
      );
    }
  }

  goBackHome() {
    this.router.navigate(['/about']);
  }

  ngOnInit(): void {
    this.setMetaData();
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    });

    const nameControl = this.contactForm.get('email');
    nameControl.valueChanges.debounceTime(800).subscribe(val => {
      this.doCheckEmail();
    });
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('description', `${this.pageName} Page`));
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
    this.meta.addTag(this.metaTagsService.setContentType());
  }
}
