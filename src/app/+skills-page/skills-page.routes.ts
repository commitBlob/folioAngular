// Core
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// App specific
import { SkillsPageComponent } from './skills-page.component';

const routes: Routes = [
  {
    path: '',
    component: SkillsPageComponent
  }
];
export const SkillsPageRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
