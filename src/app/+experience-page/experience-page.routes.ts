// Core
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// App specific
import { ExperiencePageComponent } from './experience-page.component';

const routes: Routes = [
  {
    path: '',
    component: ExperiencePageComponent
  }
];
export const ExperiencePageRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
