// Core
import { NgModule } from '@angular/core';

// App specific
import { ContactPageComponent } from './contact-page.component';
import { ContactPageService } from './contact-page.service';
import { SharedModule } from '../shared/shared.module';
import { ContactPageRoutes } from './contact-page.routes';

@NgModule({
  imports: [
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
