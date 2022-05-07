import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PontoAutomaticoPageRoutingModule } from './ponto-automatico-routing.module';

import { PontoAutomaticoPage } from './ponto-automatico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PontoAutomaticoPageRoutingModule
  ],
  declarations: [PontoAutomaticoPage]
})
export class PontoAutomaticoPageModule {}
