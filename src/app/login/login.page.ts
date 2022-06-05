import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      remember: this.fb.control(false, [Validators.required]),
    });
  }

  submit() {
    console.log('teste');
  }
}
