// Core
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// App specific
import { ContactPageComponent } from './contact-page.component';
import { ContactPageService } from './contact-page.service';
import { SharedModule } from '../shared/shared.module';
import { ContactPageRoutes } from './contact-page.routes';
import { MaterialModule } from '../shared/materialModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    ContactPageRoutes
  ],
  declarations: [
    ContactPageComponent
  ],
  providers: [
    ContactPageService
  ]
})
export class ContactPageModule {
}
