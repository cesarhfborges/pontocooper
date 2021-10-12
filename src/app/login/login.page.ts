import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, Platform} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private statusBar: StatusBar,
    private platform: Platform,
    private menu: MenuController
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
    if (!environment.production) {
      this.form.patchValue({
        username: 'cesar.borges',
        password: '@Dj.91344356',
        remember: true,
      });
    }
  }

  ngOnInit() {
    this.menu.enable(false, 'principal');
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
