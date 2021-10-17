import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {FeriasAbonosPageRoutingModule} from './ferias-abonos-routing.module';

import {FeriasAbonosPage} from './ferias-abonos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeriasAbonosPageRoutingModule
  ],
  declarations: [FeriasAbonosPage]
})
export class FeriasAbonosPageModule {}
