// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// App specific
import { AboutPageComponent } from './about-page.component';
import { AboutPageService } from './about-page.service';
import { AboutPageRoutes } from './about-page.routes';
import { FaqsBlockComponent } from './faqs-block/faqs-block.component';
import { MaterialModule } from '../shared/materialModule';

@NgModule({
  imports: [
    CommonModule,
    AboutPageRoutes,
    MaterialModule
  ],
  declarations: [
    AboutPageComponent,
    FaqsBlockComponent
  ],
  providers: [
    AboutPageService
  ]
})
export class AboutPageModule {
}
