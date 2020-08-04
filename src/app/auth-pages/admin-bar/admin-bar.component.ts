// Core
import { Component } from '@angular/core';

// App specific
import { AuthService } from '../../shared/auth-service/auth.service';

@Component({
  selector: 'app-admin-bar',
  templateUrl: 'admin-bar.component.html'
})
export class AdminBarComponent {

  expanded = false;
  doorOpen = false;

  constructor(public auth: AuthService) {
  }

  toggleSidenav(): void {
    this.expanded = !this.expanded;
  }
}
