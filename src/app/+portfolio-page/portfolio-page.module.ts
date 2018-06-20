// Core
import { NgModule } from '@angular/core';

// App specific
import { PortfolioPageRoutes } from './portfolio-page.routes';
import { PortfolioPageComponent } from './portfolio-page.component';
import { PortfolioPageService } from './portfolio-page.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PortfolioPageRoutes
  ],
  declarations: [
    PortfolioPageComponent
  ],
  providers: [
    PortfolioPageService
  ]
})
export class PortfolioPageModule {
}
