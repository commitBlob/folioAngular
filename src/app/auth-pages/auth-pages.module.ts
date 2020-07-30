// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// App specific
import { AuthPagesComponent } from './auth-pages.component';
import { AuthPagesRoutes } from './auth-pages.routes';
import { AuthService } from '../shared/auth-service/auth.service';
import { DashboardComponent } from './+dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthPagesRoutes),
    SharedModule,
  ],
  declarations: [
    AuthPagesComponent,
    DashboardComponent
  ],
  exports: [
    AuthPagesComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthPagesModule {
}
