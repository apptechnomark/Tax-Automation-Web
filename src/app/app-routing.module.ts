import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PagenotFoundComponent } from './pagenot-found/pagenot-found.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'user-verification', loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule) },
  {
    path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canActivate: [AuthGuard]
  },
  { path: 'verification', loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule) },
  { path: '**', pathMatch: 'full', component: PagenotFoundComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
