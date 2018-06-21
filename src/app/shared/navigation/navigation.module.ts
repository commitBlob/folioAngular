// Core
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// App specific
import { NavigationComponent } from './navigation.component';
import { NavigationService } from './navigation.service';

@NgModule({
  imports: [
    RouterModule, FormsModule, CommonModule
  ],
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
  providers: [NavigationService]
})
export class NavigationModule {
}
