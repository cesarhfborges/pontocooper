import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ProducaoPageRoutingModule} from './producao-routing.module';
import {ProducaoPage} from './producao.page';
import {RouterModule} from '@angular/router';
import {ModalRasuraComponent} from '../shared/components/modal-rasura/modal-rasura.component';
import {ModalHoraExtraComponent} from '../shared/components/modal-hora-extra/modal-hora-extra.component';
import {InvalidMessageComponent} from '../shared/components/invalid-message/invalid-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProducaoPageRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    ProducaoPage,
    ModalRasuraComponent,
    ModalHoraExtraComponent,
    InvalidMessageComponent
  ],
  exports: []
})
export class ProducaoPageModule {
}
