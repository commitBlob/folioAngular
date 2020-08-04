// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// App specific
import { AdminBarComponent } from './admin-bar/admin-bar.component';
import { AuthGuard } from '../shared/auth-service/auth.guard';
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
    AdminBarComponent,
    AuthPagesComponent,
    DashboardComponent
  ],
  exports: [
    AuthPagesComponent
  ],
  providers: [
    AuthGuard,
    AuthService
  ]
})
export class AuthPagesModule {
}
