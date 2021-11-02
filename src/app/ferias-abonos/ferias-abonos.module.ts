import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FeriasAbonosPageRoutingModule} from './ferias-abonos-routing.module';
import {FeriasAbonosPage} from './ferias-abonos.page';
import {SolicitarDescansoComponent} from '../shared/components/solicitar-descanso/solicitar-descanso.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeriasAbonosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FeriasAbonosPage, SolicitarDescansoComponent]
})
export class FeriasAbonosPageModule {
}
