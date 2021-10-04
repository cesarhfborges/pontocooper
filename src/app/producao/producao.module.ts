import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ProducaoPageRoutingModule} from './producao-routing.module';
import {ProducaoPage} from './producao.page';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProducaoPageRoutingModule,
    RouterModule
  ],
  declarations: [ProducaoPage]
})
export class ProducaoPageModule {
}
