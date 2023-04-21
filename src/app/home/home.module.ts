import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HomePage} from './home.page';

import {HomePageRoutingModule} from './home-routing.module';
import {BancoDeHorasComponent} from './components/banco-de-horas/banco-de-horas.component';
import {EntradasSaidasComponent} from './components/entradas-saidas/entradas-saidas.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [HomePage, BancoDeHorasComponent, EntradasSaidasComponent]
})
export class HomePageModule {
}
