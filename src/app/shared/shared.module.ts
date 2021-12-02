import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvalidMessageComponent} from './components/invalid-message/invalid-message.component';
import {DebugDirective} from './directives/debug.directive';


@NgModule({
  declarations: [
    InvalidMessageComponent,
    DebugDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InvalidMessageComponent,
    DebugDirective
  ]
})
export class SharedModule {
}
