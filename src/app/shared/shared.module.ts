// Core
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// App specific
import { MaterialModule } from './materialModule';
import { NavigationModule } from './navigation/navigation.module';
import { ProjectDetailsModule } from '../+portfolio-page/project-details/project-details.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NavigationModule,
    ProjectDetailsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
  ]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
