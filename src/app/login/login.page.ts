import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, Platform} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {ThemeDetectionResponse} from '@ionic-native/theme-detection';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private statusBar: StatusBar,
    private platform: Platform,
    private menu: MenuController,
    private themeDetection: ThemeDetection,
  ) {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
    });
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      remember: this.fb.control(false, [Validators.required]),
    });
  }

  ngOnInit() {
    this.menu.enable(false, 'principal');
    this.themeDetection.isAvailable().then((res: ThemeDetectionResponse) => {
      if (res.value) {
        this.themeDetection.isDarkModeEnabled().then((r: ThemeDetectionResponse) => {
          this.darkMode = r.value;
        }).catch(e => {});
      }
    }).catch(e => {});
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.form.disable();
      this.loading = true;
      this.authService.login(this.form.value).subscribe(
        response => {
          if (this.form.get('remember').value === true) {
            localStorage.setItem('$jsghf478==', btoa(JSON.stringify(this.form.value)));
          }
          this.form.enable();
          this.menu.enable(true, 'principal').then(r => {
            this.loading = false;
            this.router.navigate(['/home']);
          });
        },
        error => {
          console.log(error);
          this.form.enable();
          this.loading = false;
        }
      );
    }
  }
}
