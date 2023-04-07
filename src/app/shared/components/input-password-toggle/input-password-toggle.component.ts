import {Component, ContentChild, OnInit} from '@angular/core';
import {IonInput} from '@ionic/angular';

@Component({
  selector: 'app-input-password-toggle',
  templateUrl: './input-password-toggle.component.html',
  styleUrls: ['./input-password-toggle.component.scss'],
})
export class InputPasswordToggleComponent  implements OnInit {

  @ContentChild(IonInput) input: IonInput | undefined;

  showPassword = false;

  constructor() { }

  ngOnInit() {}

  toggleShow() {
    this.showPassword = !this.showPassword;
    if (this.input) {
      this.input.type = this.showPassword ? 'text' : 'password';
    }
  }
}
