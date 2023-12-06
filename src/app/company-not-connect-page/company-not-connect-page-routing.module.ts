import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyNotConnectPageComponent } from './company-not-connect-page.component';

const routes: Routes = [{ path: '', component: CompanyNotConnectPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyNotConnectPageRoutingModule { }
