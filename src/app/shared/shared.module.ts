import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule,
         MatButtonModule,
         MatFormFieldModule,
         MatIconModule,
         MatInputModule,
         MatLineModule,
         MatListModule,
         MatSnackBarModule,
         MatProgressSpinnerModule,
         MatSidenavModule,
         MatTabsModule,
         MatSlideToggleModule,
         MatToolbarModule
        } from '@angular/material';
import { NoRecordComponent } from './components/no-record/no-record.component';


@NgModule({
  declarations: [NoRecordComponent],
  imports: [
    MatIconModule
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    NoRecordComponent
  ]
})
export class SharedModule { }
