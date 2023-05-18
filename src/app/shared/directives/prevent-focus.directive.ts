import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appPreventFocus]'
})
export class PreventFocusDirective {

  constructor(
    private elRef: ElementRef
  ) {}

  @HostListener('click', ['$event']) onClick($event: any) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.recursiveBlur(this.elRef.nativeElement.children);
  }

  private recursiveBlur(elements: any[]): void {
    for (const element of elements) {
      if (element.children.length > 0) {
        this.recursiveBlur(element.children);
      } else {
        return element.blur();
      }
    }
  }
}
