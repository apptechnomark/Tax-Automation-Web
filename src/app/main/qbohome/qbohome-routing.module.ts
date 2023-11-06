import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbohomeComponent } from './qbohome.component';

const routes: Routes = [{ path: '', component: QbohomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QbohomeRoutingModule { }
