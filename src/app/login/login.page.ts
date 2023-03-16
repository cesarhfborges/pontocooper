import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ViewWillEnter} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillEnter {

  @ViewChild('inputUsername') inputUser: any;

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      remember: this.fb.control(false, [Validators.required]),
    });
  }

  ngOnInit() {
  }

  onSubmit(): void {
  }

  ionViewWillEnter(): void {
  }
}
