// Core
import { NgModule } from '@angular/core';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

const modules = [
  MatTabsModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatExpansionModule
];

@NgModule({
  imports: [
    ...modules
  ],
  exports: [
    ...modules
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class MaterialModule {}
