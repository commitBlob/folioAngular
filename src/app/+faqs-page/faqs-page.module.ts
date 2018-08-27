// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// App specific
import { FaqsBlockComponent } from './faqs-block.component';
import { MaterialModule } from '../shared/materialModule';
import { FaqsPageService } from './faqs-page.service';
import { FaqsPageRoutes } from './faqs-page.routes';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FaqsPageRoutes
  ],
  declarations: [
    FaqsBlockComponent
  ],
  providers: [
    FaqsPageService
  ]
})
export class FaqsPageModule {
}
