import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProducaoPageRoutingModule } from './producao-routing.module';

import { ProducaoPage } from './producao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProducaoPageRoutingModule
  ],
  declarations: [ProducaoPage]
})
export class ProducaoPageModule {}
