import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appDebug]'
})
export class DebugDirective {

  count = 0;
  debug: boolean;

  constructor() {
    if (!localStorage.getItem('debug_mode')) {
      localStorage.setItem('debug_mode', '0');
    }
    this.debug = localStorage.getItem('debug_mode') === '1';
  }

  @HostListener('click', ['$event']) onClick($event: any) {
    this.count++;
    if (this.count > 9) {
      this.count = 0;
      this.debug = !this.debug;
      localStorage.setItem('debug_mode', this.debug ? '1' : '0');
    }
    // console.log(this.count);
    // console.log(this.debug);
    // console.info('clicked: ' + $event);
  }
}
