// Core
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// App specific
import { FaqsBlockComponent } from './faqs-block.component';

const routes: Routes = [
  {
    path: '',
    component: FaqsBlockComponent
  }
];
export const FaqsPageRoutes: ModuleWithProviders = RouterModule.forChild(routes);
