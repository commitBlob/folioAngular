// Core
import { Routes } from '@angular/router';

// App specific
import { PageNotFoundComponent } from './404-page/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadChildren: 'app/+about-page/about-page.module#AboutPageModule'
  },
  {
    path: 'contact',
    loadChildren: 'app/+contact-page/contact-page.module#ContactPageModule'
  },
  {
    path: 'portfolio',
    loadChildren: 'app/+portfolio-page/portfolio-page.module#PortfolioPageModule'
  },
  {
    path: 'skills',
    loadChildren: 'app/+skills-page/skills-page.module#SkillsPageModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
