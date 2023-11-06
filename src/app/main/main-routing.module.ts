import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
                canActivate: [AuthGuard]
            }]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
