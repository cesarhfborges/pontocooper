import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Opcoes } from '../shared/models';
import { ViewWillEnter } from '@ionic/angular';
import { AuthenticateOptions, BiometricAuth } from '@aparajita/capacitor-biometric-auth';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit, ViewWillEnter {

  form: FormGroup;

  opcoes: Opcoes;

  biometryAvaliable: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) {
    this.opcoes = {
      darkMode: [
        {label: 'Automático', value: 'automatico'},
        {label: 'Escuro', value: 'escuro'},
        {label: 'Claro', value: 'claro'},
      ],
    };
    this.form = this.fb.group({
      darkMode: ['', [Validators.required]],
      biometry: [false, Validators.required],
    });
  }

  get biometryEnabled(): boolean {
    return this.form.get('biometry')?.value ?? false;
  }

  ngOnInit() {
    Promise.all([
      this.checkBiometryAvaliable(),
    ]).then(r => {
      this.biometryAvaliable = r[0];
    })
  }

  ionViewWillEnter(): void {
  }

  async toggleBiometry($event: any) {
    if ($event.detail) {
      if ($event.detail.checked) {
        const auth = await this.authenticate();
        this.form.get('biometry')?.patchValue(auth);
      } else {
        this.form.get('biometry')?.patchValue(false);
      }
    }
  }

  async checkBiometryAvaliable() {
    try {
      const res = await BiometricAuth.checkBiometry();
      return Promise.resolve(res.isAvailable);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      const options: AuthenticateOptions = {
        reason: 'Validação necessária para acessar o app.',
        allowDeviceCredential: true,
        androidSubtitle: 'Verificação de identidade.',
        androidTitle: 'Autenticação Biométrica',
        cancelTitle: 'Cancelar',
        iosFallbackTitle: 'Fallback',
      };
      await BiometricAuth.authenticate(options);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }
}
