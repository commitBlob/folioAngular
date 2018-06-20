// Core
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// App specific
import { ContactPageComponent } from './contact-page.component';

const routes: Routes = [
  {
    path: '',
    component: ContactPageComponent
  }
];
export const ContactPageRoutes: ModuleWithProviders = RouterModule.forChild(routes);
