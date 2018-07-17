// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// App specific
import { ProjectDetailsComponent } from './project-details.component';
import { ProjectDetailsService } from './project-details.service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ProjectDetailsComponent
  ],
  exports: [
    ProjectDetailsComponent
  ],
  providers: [
    ProjectDetailsService
  ]
})
export class ProjectDetailsModule {
}
