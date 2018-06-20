// Core
import { NgModule } from '@angular/core';

// App specific
import { SharedModule } from '../shared/shared.module';
import { SkillsPageRoutes } from './skills-page.routes';
import { SkillsPageComponent } from './skills-page.component';
import { SkillsPageService } from './skills-page.service';

@NgModule({
  imports: [
    SharedModule,
    SkillsPageRoutes
  ],
  declarations: [
    SkillsPageComponent
  ],
  providers: [
    SkillsPageService
  ]
})
export class SkillsPageModule {
}
