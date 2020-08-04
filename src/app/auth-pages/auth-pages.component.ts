// Core
import { Component } from '@angular/core';

// App specific
import { AuthService } from '../shared/auth-service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: 'auth-pages.component.html'
})
export class AuthPagesComponent {

  constructor(public auth: AuthService) {
  }
}
