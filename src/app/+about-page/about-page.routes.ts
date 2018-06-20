// Core
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AboutPageComponent } from './about-page.component';

const routes: Routes = [
  {
    path: '',
    component: AboutPageComponent
  }
];
export const AboutPageRoutes: ModuleWithProviders = RouterModule.forChild(routes);
