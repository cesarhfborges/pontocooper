import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ViewWillEnter} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {ToastsService} from '../shared/services/toasts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillEnter {

  @ViewChild('inputUsername') inputUser: any;
  @ViewChild('inputPass') inputPass: HTMLIonInputElement | undefined;

  form: FormGroup;
  loading = false;

  hidePasswd = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastsService: ToastsService,
  ) {
    this.form = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      remember: this.fb.control(false, [Validators.required]),
    });
    if (!environment.production) {
      this.form.patchValue({
        username: 'cesar.borges',
        password: '@Dj.91344356',
        remember: true
      });
    }
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.loading = true;
      this.authService.login(this.form.value).subscribe({
        next: (response) => {
          this.form.enable();
          this.loading = false;
          this.router.navigate(['/home']).then();
        },
        error: (error) => {
          this.form.enable();
          this.toastsService.showToastDanger('Usuário e/ou senha inválido(s), tente novamente');
          this.form?.get('password')?.reset();
          // TODO: ajustar quando estiver no emulador
          // this.inputPass?.getInputElement().then(r => {
          //   console.log(r);
          //   r.focus();
          // });
          // // this.inputUser.setFocus();
          this.loading = false;
        }
      });
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
