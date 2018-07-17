import { NgModule } from '@angular/core';
import { ProjectDetailsComponent } from './project-details.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ProjectDetailsComponent
  ],
  exports: [
    ProjectDetailsComponent
  ]
})
export class ProjectDetailsModule {
}
