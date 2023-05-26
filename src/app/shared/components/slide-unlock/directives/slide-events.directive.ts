import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appSlideEvents]',
})
export class SlideEventsDirective implements AfterViewInit {

  private element: any | undefined;
  private currentValue = 0;
  private minValue: number = 0;
  private maxValue: number = 100;
  private speed: number = 5;
  private rafID: any | undefined;

  @Output() onDrop: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  @HostListener('mousedown', ['$event.target.value'])
  onMouseDown(value: string) {
    const n = Number(value);
    this.unlockStartHandler(n);
  }

  @HostListener('mousestart', ['$event.target.value'])
  onMouseStart(value: string) {
    const n = Number(value);
    this.unlockStartHandler(n);
  }

  @HostListener('mouseup', ['$event.target.value'])
  onMouseUp(value: string) {
    const n = Number(value);
    this.unlockEndHandler(n);
  }

  @HostListener('touchend', ['$event.target.value'])
  onTouchEnd(value: string) {
    const n = Number(value);
    this.unlockEndHandler(n);
  }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement;
    this.element.value = this.currentValue;
    this.element.min = this.minValue;
    this.element.max = this.maxValue;
  }

  unlockStartHandler(value: number) {
    window.cancelAnimationFrame(this.rafID);
    this.currentValue = value;
  }

  private unlockEndHandler(value: number) {
    this.currentValue = value;
    if(this.currentValue >= this.maxValue) {
      this.onDrop.emit(true);
      // this.element.disable();
      // setTimeout(() => {
      //   this.currentValue = 0;
      //   this.element.value = 0;
      // }, 3500);
    } else {
      this.onDrop.emit(false);
      this.rafID = window.requestAnimationFrame(this.animateHandler.bind(this));
    }
  }

  private animateHandler() {
    this.element.value = this.currentValue;
    if(this.currentValue > -1) {
      window.requestAnimationFrame(this.animateHandler.bind(this));
    }
    this.currentValue = this.currentValue - this.speed;
  }
}
