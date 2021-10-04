import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PerfilPageRoutingModule} from './perfil-routing.module';
import {PerfilPage} from './perfil.page';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    RouterModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {
}
