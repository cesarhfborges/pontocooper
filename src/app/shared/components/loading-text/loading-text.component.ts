import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-text',
  templateUrl: './loading-text.component.html',
  styleUrls: ['./loading-text.component.scss'],
})
export class LoadingTextComponent  implements OnInit {

  @Input() loading: boolean;
  @Input() animated: boolean;
  @Input() width: number;

  constructor() {
    this.loading = false;
    this.animated = false;
    this.width = 100;
  }

  get sizeOfWidth(): string {
    return `${this.width}%`;
  }

  ngOnInit() {}
}
