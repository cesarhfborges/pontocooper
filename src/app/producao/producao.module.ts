import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ProducaoPageRoutingModule} from './producao-routing.module';
import {ProducaoPage} from './producao.page';
import {RouterModule} from '@angular/router';
import {ModalRasuraComponent} from '../shared/components/modal-rasura/modal-rasura.component';
import {ModalHoraExtraComponent} from '../shared/components/modal-hora-extra/modal-hora-extra.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProducaoPageRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    ProducaoPage,
    ModalRasuraComponent,
    ModalHoraExtraComponent,
  ],
  exports: []
})
export class ProducaoPageModule {
}
