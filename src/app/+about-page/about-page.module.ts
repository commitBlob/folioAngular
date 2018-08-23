// Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// App specific
import { AboutPageComponent } from './about-page.component';
import { AboutPageService } from './about-page.service';
import { AboutPageRoutes } from './about-page.routes';

@NgModule({
  imports: [
    CommonModule,
    AboutPageRoutes
  ],
  declarations: [
    AboutPageComponent
  ],
  providers: [
    AboutPageService
  ]
})
export class AboutPageModule {
}
