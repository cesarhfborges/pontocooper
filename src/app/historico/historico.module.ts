import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HistoricoPageRoutingModule} from './historico-routing.module';
import {HistoricoPage} from './historico.page';
import {OpenLayersComponent} from '../shared/components/open-layers/open-layers.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoPageRoutingModule
  ],
  declarations: [
    HistoricoPage,
    OpenLayersComponent
  ]
})
export class HistoricoPageModule {
}
