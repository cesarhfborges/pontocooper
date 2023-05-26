import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SlideEventsDirective } from './directives/slide-events.directive';

type Colors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-slide-unlock',
  templateUrl: './slide-unlock.component.html',
  styleUrls: ['./slide-unlock.component.scss'],
  providers: [
    SlideEventsDirective,
  ],
})
export class SlideUnlockComponent implements OnInit {

  @ViewChild('inputSlider') inputSlider: ElementRef | undefined;
  @Input() title: string | null = null;
  @Input() color: Colors = 'primary';
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  ) {
  }

  ngOnInit() {
  }

  onDropped($event: boolean) {
    if ($event) {
      console.log('Complete slide')
      this.onComplete.emit(true);
    }
  }
}
