// Core
import { Routes } from '@angular/router';

// App specific
import { PageNotFoundComponent } from './404-page/page-not-found.component';
import { ProjectDetailsComponent } from './+portfolio-page/project-details/project-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
    data: { animation: 'home' }
  },
  {
    path: 'about',
    loadChildren: () => import('app/+about-page/about-page.module').then(m => m.AboutPageModule),
    data: { animation: 'about' }
  },
  {
    path: 'contact',
    loadChildren: () => import('app/+contact-page/contact-page.module').then(m => m.ContactPageModule),
    data: { animation: 'contact' }
  },
  {
    path: 'portfolio',
    loadChildren: () => import('app/+portfolio-page/portfolio-page.module').then(m => m.PortfolioPageModule),
    data: { animation: 'portfolio' }
  },
  {
    path: 'skills',
    loadChildren: () => import('app/+skills-page/skills-page.module').then(m => m.SkillsPageModule),
    data: { animation: 'skills' }
  },
  {
    path: 'experience',
    loadChildren: () => import('app/+experience-page/experience-page.module').then(m => m.ExperiencePageModule),
    data: { animation: 'experience' }
  },
  {
    path: 'faqs',
    loadChildren: () => import('app/+faqs-page/faqs-page.module').then(m => m.FaqsPageModule)
  },
  {
    path: 'portfolio/:project',
    component: ProjectDetailsComponent,
    data: { animation: 'project-details' }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
