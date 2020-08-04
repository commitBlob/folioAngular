// Core
import { Component } from '@angular/core';

// App specific
import { AuthService } from '../../shared/auth-service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  constructor(public auth: AuthService) {
  }

}
