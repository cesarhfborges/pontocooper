import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterLink
  ]
})
export class SharedModule { }
