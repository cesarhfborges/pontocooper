import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {CustomValidatorService} from './custom-validator.service';

@Component({
  selector: 'app-invalid-message',
  templateUrl: './invalid-message.component.html',
  styleUrls: ['./invalid-message.component.scss'],
})
export class InvalidMessageComponent implements OnInit {

  @Input() control: AbstractControl;

  constructor() {
  }

  ngOnInit() {
  }

  get errorMessage(): any {
    for (const propriedade in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propriedade) && this.control.touched) {
        return CustomValidatorService.getValidatorErrorMessage(propriedade, this.control.errors[propriedade]);
      }
    }
    return null;
  }

}
