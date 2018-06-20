// Core
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// App specific
import { PortfolioPageComponent } from './portfolio-page.component';


const routes: Routes = [
  {
    path: '',
    component: PortfolioPageComponent
  }
];
export const PortfolioPageRoutes: ModuleWithProviders = RouterModule.forChild(routes);
