import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvalidMessageComponent} from './components/invalid-message/invalid-message.component';


@NgModule({
  declarations: [
    InvalidMessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InvalidMessageComponent
  ]
})
export class SharedModule {
}
