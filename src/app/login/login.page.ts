import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Preferences} from '@capacitor/preferences';
import {ViewWillEnter} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';

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
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      username: this.fb.control('cesar.borges', [Validators.required]),
      password: this.fb.control('@Dj.91344356', [Validators.required, Validators.minLength(4)]),
      remember: this.fb.control(false, [Validators.required]),
    });
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.loading = true;
      this.authService.login(this.form.value).subscribe(
        () => {
          this.form.enable();
          this.loading = false;
          // this.router.navigate(['/home']).then();
        },
        error => {
          console.log(error);
          this.form.enable();
          // this.toastsService.showToastDanger('Usuário e/ou senha inválido(s), tente novamente');
          // this.form.get('password').reset();
          this.inputUser.setFocus();
          this.loading = false;
        }
      );
    }
  }

  ionViewWillEnter(): void {
    Promise.all([
      // this.getAuth()
    ]).then(f => {
      console.log('finalizado !!!!');
    }).catch(e => {
      console.log('error: ', e);
    });
  }

  // async getAuth() {
  //   const {value} = await Preferences.get({key: 'name'});
  //   if (value) {
  //     console.log(`Hello ${value}!`);
  //   } else {
  //     throw new Error('teste');
  //   }
  // }
}
