import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Opcoes } from '../shared/models';
import { ViewWillEnter } from '@ionic/angular';
import { NativeBiometric } from 'capacitor-native-biometric';
import { BiometricOptions, Credentials } from 'capacitor-native-biometric/dist/esm/definitions';
import { OptionsService } from '../shared/services';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit, ViewWillEnter {

  form: FormGroup;

  opcoes: Opcoes;

  biometryAvaliable: boolean = false;
  private biometricServer: string = 'portal.coopersystem.com.br';

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

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    Promise.all([
      this.checkBiometryAvaliable(),
      this.getBiometryCredentials(),
    ]).then(r => {
      this.biometryAvaliable = r[0];
      if (r[0]) {
        this.form.get('biometry')?.patchValue(r[1])
      }
    })
  }

  async getBiometryCredentials(): Promise<boolean> {
    try {
      const response = await NativeBiometric.getCredentials({
        server: this.biometricServer,
      });
      return Promise.resolve(!!response);
    } catch (e: any) {
      return Promise.resolve(false);
    }
  }

  async checkBiometryAvaliable() {
    try {
      const result = await NativeBiometric.isAvailable();
      return Promise.resolve(result.isAvailable);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  get biometryEnabled(): boolean {
    return this.form.get('biometry')?.value ?? false;
  }

  async disableBiometry() {
    try {
      await NativeBiometric.deleteCredentials({server: this.biometricServer});
      this.form.get('biometry')?.patchValue(false);
      console.log('sucesso');
    } catch (e) {
      console.log('error: ', e);
    }
  }
}
