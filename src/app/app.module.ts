// Core
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// App specific
import { AppComponent } from './app.component';
import { AuthPagesModule } from './auth-pages/auth-pages.module';
import { BrowserDetectService } from './shared/browser-detect/browser-detect.service';
import { BrowserUnsupportedComponent } from './shared/browser-unsupported/browser-unsupported.component';
import { GoogleAnalyticsService } from './shared/google-analytics/google-analytics.service';
import { MaterialModule } from './shared/materialModule';
import { MetaTagsService } from './shared/meta-tags/meta-tags.service';
import { PageNotFoundModule } from './404-page/page-not-found.module';
import { routes } from './app.routes';
import { SharedModule } from './shared/shared.module';

// External
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    BrowserUnsupportedComponent
  ],
  imports: [
    AuthPagesModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    PageNotFoundModule,
    RouterModule.forRoot(routes),
    SharedModule.forRoot(),
    HammerModule
  ],
  exports: [
    MaterialModule
  ],
  providers: [
    BrowserDetectService,
    GoogleAnalyticsService,
    MetaTagsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(protected  googleAnalyticssService: GoogleAnalyticsService) {}
}
