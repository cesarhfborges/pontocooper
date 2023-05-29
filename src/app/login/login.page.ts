import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, Platform, ViewWillEnter } from '@ionic/angular';
import { AuthService, Credenciais } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastsService } from '../shared/services';
import { Animation, StatusBar, Style } from '@capacitor/status-bar';
import { NativeBiometric } from 'capacitor-native-biometric';
import { BiometricOptions, Credentials } from 'capacitor-native-biometric/dist/esm/definitions';
import { lastValueFrom } from 'rxjs';

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
  biometryAvaliable: boolean = false;
  biometricAccessEnabled: boolean = false;
  private biometricServer: string = 'portal.coopersystem.com.br';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastsService: ToastsService,
    private platform: Platform,
    private loadingController: LoadingController,
  ) {
    this.form = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      remember: this.fb.control(false, [Validators.required]),
      biometry: [false, []],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        Promise.all([
          this.checkBiometryAvaliable(),
          this.getBiometryCredentials(),
        ]).then(r => {
          console.log('then: ', r);
          this.biometryAvaliable = r[0];
          this.biometricAccessEnabled = r[1] !== null;
          if (r[1] !== null) {
            this.form.get('username')?.patchValue(r[1].username);
            this.authenticateOnInit(r[1]);
          }
        }).catch(e => {
          console.log('catch: ', e);
        });
        if (this.platform.is('android')) {
          await StatusBar.show({animation: Animation.Fade});
          await StatusBar.setOverlaysWebView({overlay: false});
          await StatusBar.setStyle({style: Style.Dark});
          await StatusBar.setBackgroundColor({color: '#000000'});
        }
        if (this.platform.is('ios')) {
          // await StatusBar.show({animation: Animation.Slide});
          // await StatusBar.setStyle({style: Style.Dark});
          // await StatusBar.setBackgroundColor({color: '#178865'});
        }
      }
    }).catch(e => {
    });
  }

  async onSubmit() {
    try {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        this.form.disable();
        this.loading = true;
        const credenciais: Credenciais = {
          username: this.form.get('username')?.value,
          password: this.form.get('password')?.value,
        };
        await this.authenticate(credenciais);
        if (this.biometryAvaliable && !this.biometricAccessEnabled && this.form.get('biometry')?.value) {
          const res = await this.checkBiometricCredentials();
          if (res) {
            await this.saveBiometricCredentials(credenciais);
            this.toastsService.showToastSuccess('Biometria ativada com sucesso.');
          } else {
            this.toastsService.showToastWarning('Biometria não foi ativada, tente novamente depois.');
          }
        }
        this.form.enable();
        this.loading = false;
        this.router.navigate(['/home']).then();
        console.log('sucesso');
        return Promise.resolve();
      }
    } catch (e) {
      this.loading = false;
      this.form?.enable();
      this.form?.get('password')?.reset();
      this.toastsService.showToastDanger('Usuário e/ou senha inválido(s), tente novamente');
    }
  }

  async authenticateOnInit(credenciais: Credenciais): Promise<void> {
    try {
      this.loading = true;
      this.form.disable();
      const res = await this.checkBiometricCredentials();
      const loading = await this.showLoading('Aguarde');
      if (res) {
        await loading?.present();
        await this.authenticate(credenciais);
      }
      this.loading = false;
      this.form.enable();
      await loading?.dismiss();
      this.router.navigate(['/home']).then();
    } catch (e) {
      this.loading = false;
      this.form.enable();
      console.log(e);
    }
  }

  async checkBiometricCredentials(): Promise<boolean> {
    try {
      const options: BiometricOptions = {
        reason: 'authentication',
        title: 'Autenticação Biométrica',
        subtitle: 'Verificação de identidade.',
        description: 'Validação necessária para acessar o app.',
        fallbackTitle: 'Cancelar',
        maxAttempts: 3,
        useFallback: false,
        negativeButtonText: 'Cancelar',
      };
      await NativeBiometric.verifyIdentity(options);
      return Promise.resolve(true);
    } catch (e) {
      console.log('reason:', e);
      if (e === 'Error: Authentication failed.') {
        await NativeBiometric.deleteCredentials({server: this.biometricServer});
        this.toastsService.showToastWarning('Biometria foi desativada.');
      }
      return Promise.resolve(false);
    }
  }

  async saveBiometricCredentials(credenciais: Credenciais): Promise<boolean> {
    try {
      await NativeBiometric.setCredentials({
        username: credenciais.username,
        password: credenciais.password,
        server: this.biometricServer,
      });
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  async authenticate(credenciais: Credenciais) {
    try {
      const res = await lastValueFrom(this.authService.login(credenciais));
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Não foi possível autenticar.')
    }
  }

  async checkBiometryAvaliable() {
    try {
      const {isAvailable} = await NativeBiometric.isAvailable();
      return Promise.resolve(isAvailable);
    } catch (e) {
      return Promise.reject(false);
    }
  }

  async getBiometryCredentials(): Promise<Credentials | null> {
    try {
      const response = await NativeBiometric.getCredentials({
        server: this.biometricServer,
      });
      return Promise.resolve(response);
    } catch (e: any) {
      return Promise.resolve(null);
    }
  }

  private async showLoading(message: string, duration: number = 2500) {
    const loading = await this.loadingController.create({
      message,
      duration,
      backdropDismiss: false,
      keyboardClose: false,
      showBackdrop: true,
      animated: true,
      spinner: 'bubbles',
      cssClass: 'my-custom-class',
    });
    return Promise.resolve(loading);
    // await loading.present();
  }
}
