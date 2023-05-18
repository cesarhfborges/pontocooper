import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appPreventFocus]'
})
export class PreventFocusDirective {

  constructor(
    private elRef: ElementRef
  ) {
    // const teste: ElementRef = this.elRef.nativeElement;
    // console.log(teste);
    // console.log(typeof teste);
    // const el = this.elRef.nativeElement as HTMLElement;
    // el.addEventListener('click', ($event) => {
    //   $event.preventDefault();
    //   $event.stopImmediatePropagation();
    //   console.log('clickei');
    // });
  }

  @HostListener('click', ['$event']) onClick($event: any) {
    // const el = this.elRef.nativeElement as HTMLElement;
    // console.log(el);
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.recursiveBlur(this.elRef.nativeElement.children);
  }

  private recursiveBlur(elements: any[]): void {
    for (const element of elements) {
      // console.log(element);
      if (element.children.length > 0) {
        this.recursiveBlur(element.children);
      } else {
        return element.blur();
      }
    }
  }
}
