
// Core
import { Route } from '@angular/router';

// App specific
import { AuthPagesComponent } from './auth-pages.component';
import { DashboardComponent } from './+dashboard/dashboard.component';


export const AuthPagesRoutes: Route[] = [
  {
    path: 'kantun',
    component: AuthPagesComponent,
    // canActivate: [],
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      }
    ]
  }
];
