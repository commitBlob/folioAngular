// Core
import { Routes } from '@angular/router';

// App specific
import { PageNotFoundComponent } from './404-page/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    data: { animation: 'home' }
  },
  {
    path: 'about',
    loadChildren: 'app/+about-page/about-page.module#AboutPageModule',
    data: { animation: 'about' }
  },
  {
    path: 'contact',
    loadChildren: 'app/+contact-page/contact-page.module#ContactPageModule',
    data: { animation: 'contact' }
  },
  {
    path: 'portfolio',
    loadChildren: 'app/+portfolio-page/portfolio-page.module#PortfolioPageModule',
    data: { animation: 'portfolio' }
  },
  {
    path: 'skills',
    loadChildren: 'app/+skills-page/skills-page.module#SkillsPageModule',
    data: { animation: 'skills' }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
