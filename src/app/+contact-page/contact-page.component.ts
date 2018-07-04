// Core
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

// App specific
import { ContactPageService } from './contact-page.service';

// App specific

@Component({
  selector: 'folio-contact',
  templateUrl: 'contact-page.component.html',
})
export class ContactPageComponent implements OnInit {

  contactForm: FormGroup;

  animateMe = false;

  emailError = '';

  private bodyValidationMessages = {
    required: 'Please insert your message'
  };

  constructor(private formBuilder: FormBuilder,
              private contactService: ContactPageService) {
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

      // this.contactService.submitForm(contactFormBody).subscribe(
      //   (res) => {
      //     console.log('TODO: call dialog with response');
      //   },
      //   (error) => {
      //     console.log('ERROR DIALOG HERE');
      //   }
      // );
    }
  }

  ngOnInit(): void {
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
}
