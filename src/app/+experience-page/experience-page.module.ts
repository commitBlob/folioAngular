// Core
import { NgModule } from '@angular/core';

// App specific
import { ExperiencePageComponent } from './experience-page.component';
import { ExperiencePageRoutes } from './experience-page.routes';
import { ExperiencePageService } from './experience-page.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ExperiencePageRoutes
  ],
  declarations: [
    ExperiencePageComponent
  ],
  providers: [
    ExperiencePageService
  ]
})
export class ExperiencePageModule {
}
