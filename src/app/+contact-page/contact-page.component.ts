// Core
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

// App specific

@Component({
  selector: 'folio-contact',
  templateUrl: 'contact-page.component.html'
})
export class ContactPageComponent implements OnInit {

  contactForm: FormGroup;

  nameError = '';
  emailError = '';
  messageError = '';

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

  constructor(private formBuilder: FormBuilder) {}

  private setName(c: AbstractControl): void {
    this.nameError = '';
    if ((c.touched || c.dirty) && c.errors) {

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
