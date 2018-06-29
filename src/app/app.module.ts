// Core
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// App specific
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/materialModule';
import { PageNotFoundModule } from './404-page/page-not-found.module';
import { routes } from './app.routes';
import { SharedModule } from './shared/shared.module';

// External
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    PageNotFoundModule,
    RouterModule.forRoot(routes),
    SharedModule.forRoot()
  ],
  exports: [
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
