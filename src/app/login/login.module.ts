import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {LoginPageRoutingModule} from './login-routing.module';
import {LoginPage} from './login.page';
import {RouterModule} from '@angular/router';
import {InvalidMessageComponent} from '../shared/components/invalid-message/invalid-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    LoginPage,
    InvalidMessageComponent
  ]
})
export class LoginPageModule {
}
