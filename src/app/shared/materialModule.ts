// Core
import { NgModule } from '@angular/core';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    // tslint:disable-next-line
    MatTabsModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatDatepickerModule
  ],
  exports: [
    // tslint:disable-next-line
    MatTabsModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatDatepickerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class MaterialModule {}
