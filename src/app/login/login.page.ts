import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, Platform, ViewDidEnter} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {ThemeDetectionResponse} from '@ionic-native/theme-detection';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {ToastsService} from '../shared/services/toasts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewDidEnter {

  @ViewChild('inputUsername') inputUser;

  darkMode = false;

  logotipo: {
    normal: string;
    dark: string;
  } = {
    normal: 'assets/logo-horizontal.png',
    dark: 'assets/logo-horizontal-white.png'
  };

  form: FormGroup;
  loading = false;

  opcoes: any = JSON.parse(localStorage.getItem('opcoes'));

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private statusBar: StatusBar,
    private platform: Platform,
    private menu: MenuController,
    private themeDetection: ThemeDetection,
    private toastsService: ToastsService,
  ) {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.overlaysWebView(true);
        this.statusBar.styleLightContent();
      });
    }
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      remember: this.fb.control(false, [Validators.required]),
    });
    if (this.opcoes !== null) {
      this.form.get('remember').patchValue(this.opcoes.loginRemember);
    }
  }

  ngOnInit() {
    this.themeDetection.isAvailable().then((res: ThemeDetectionResponse) => {
      if (res.value) {
        this.themeDetection.isDarkModeEnabled().then((r: ThemeDetectionResponse) => {
          this.darkMode = r.value;
        }).catch(() => {
        });
      }
    }).catch(() => {
    });
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
          this.router.navigate(['/home']).then();
        },
        error => {
          console.log(error);
          this.form.enable();
          this.toastsService.showToastDanger('Usuário e/ou senha inválido(s), tente novamente');
          this.form.get('password').reset();
          this.inputUser.setFocus();
          this.loading = false;
        }
      );
    }
  }

  ionViewDidEnter(): void {
    this.menuControl(false).catch(e => console.log(e));
  }

  async menuControl(status: boolean): Promise<void> {
    if (await this.menu.isOpen()) {
      await this.menu.close();
    }
    await this.menu.enable(status, 'principal');
    return Promise.resolve();
  }
}
