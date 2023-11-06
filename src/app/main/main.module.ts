import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SidebarModule,
    HeaderModule,
    FooterModule
  ],
  providers: [],
  exports: [
    MainComponent
  ]
})
export class MainModule { }
