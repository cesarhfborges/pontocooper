import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './components/menu/menu.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    MenuComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ],
  exports: [
    MenuComponent
  ]
})
export class SharedModule {
}
