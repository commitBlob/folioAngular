// Core
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { ContactPageService } from './contact-page.service';

// App specific

@Component({
  selector: 'folio-contact',
  templateUrl: 'contact-page.component.html'
})
export class ContactPageComponent implements OnInit {

  contactForm: FormGroup;

  nameError: any[];
  emailError: any[];
  messageError: any[];

  private nameValidationMessages = {
    required: 'Please fill in your name'
  };

  private emailValidationMessages = {
    required: 'Please insert your email address',
    pattern: 'Email format seems to be invalid'
  };

  private bodyValidationMessages = {
    required: 'Please insert your message'
  };

  constructor(private formBuilder: FormBuilder,
              private contactService: ContactPageService) {}

  private setName(c: AbstractControl): void {
    if ((c.touched || c.dirty) && c.errors) {
      this.nameError = Object.keys(c.errors).map(key => this.nameValidationMessages[key].join(' '));
    }
  }

  submitForm() {
    if (this.contactForm.valid) {
      const contactFormBody = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message
      };

      this.contactService.submitForm(contactFormBody).subscribe(
        (res) => {
          console.log('TODO: call dialog with response');
        },
        (error) => {
          console.log('ERROR DIALOG HERE');
        }
      );
    }
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    });

    const nameControl = this.contactForm.get('name');
    nameControl.valueChanges.debounceTime(800).subscribe();
  }
}
