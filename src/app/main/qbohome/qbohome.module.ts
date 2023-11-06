import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QbohomeRoutingModule } from './qbohome-routing.module';
import { QbohomeComponent } from './qbohome.component';


@NgModule({
  declarations: [
    QbohomeComponent
  ],
  imports: [
    CommonModule,
    QbohomeRoutingModule
  ]
})
export class QbohomeModule { }
