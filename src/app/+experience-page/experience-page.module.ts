// Core
import { NgModule } from '@angular/core';

// App specific
import { ExperiencePageComponent } from './experience-page.component';
import { ExperiencePageRoutes } from './experience-page.routes';
import { ExperiencePageService } from './experience-page.service';
import { SharedModule } from '../shared/shared.module';
import { ExperienceProjectsComponent } from './experience-projects/experience-projects.component';

@NgModule({
  imports: [
    SharedModule,
    ExperiencePageRoutes
  ],
  declarations: [
    ExperiencePageComponent,
    ExperienceProjectsComponent
  ],
  providers: [
    ExperiencePageService
  ]
})
export class ExperiencePageModule {
}
