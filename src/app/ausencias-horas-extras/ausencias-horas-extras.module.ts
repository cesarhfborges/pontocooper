import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AusenciasHorasExtrasPageRoutingModule} from './ausencias-horas-extras-routing.module';

import {AusenciasHorasExtrasPage} from './ausencias-horas-extras.page';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AusenciasHorasExtrasPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [AusenciasHorasExtrasPage]
})
export class AusenciasHorasExtrasPageModule {
}
