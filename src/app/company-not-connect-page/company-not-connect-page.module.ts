import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyNotConnectPageRoutingModule } from './company-not-connect-page-routing.module';
import { CompanyNotConnectPageComponent } from './company-not-connect-page.component';


@NgModule({
  declarations: [
    CompanyNotConnectPageComponent
  ],
  imports: [
    CommonModule,
    CompanyNotConnectPageRoutingModule
  ]
})
export class CompanyNotConnectPageModule { }
