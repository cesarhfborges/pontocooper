import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';
import {InvalidMessageComponent} from './components/invalid-message/invalid-message.component';
import {InputPasswordToggleComponent} from './components/input-password-toggle/input-password-toggle.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    InvalidMessageComponent,
    InputPasswordToggleComponent
  ],
  exports: [
    InvalidMessageComponent,
    InputPasswordToggleComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterLink
  ]
})
export class SharedModule { }
