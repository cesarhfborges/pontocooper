import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {ToastsService} from '../shared/services/toasts.service';
import {LoadingController, Platform} from '@ionic/angular';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit {

  opcoes: {
    darkMode: Array<{ label: string; value: 'automatico' | 'escuro' | 'claro' }>;
    loginRemember: Array<{ label: string; value: boolean }>;
  } = {
    darkMode: [
      {
        label: 'Automático',
        value: 'automatico'
      },
      {
        label: 'Escuro',
        value: 'escuro'
      },
      {
        label: 'Claro',
        value: 'claro'
      },
    ],
    loginRemember: [
      {
        label: 'Sim',
        value: true
      },
      {
        label: 'Não',
        value: false
      },
    ]
  };

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private themeDetection: ThemeDetection,
    private toastsService: ToastsService,
    private platform: Platform,
    private loadingController: LoadingController
  ) {
    this.form = this.fb.group({
      darkMode: this.fb.control('automatico', [Validators.required]),
      loginRemember: this.fb.control(false, [Validators.required]),
      valorAcumulado: this.fb.control(false, [Validators.required]),
    });
    const opcoes: any = localStorage.getItem('opcoes');
    this.form.patchValue(JSON.parse(opcoes));
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(
      response => {
        localStorage.setItem('opcoes', JSON.stringify(response));
      }
    );
    this.form.get('darkMode').valueChanges.subscribe(
      response => {
        this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Alterando esquema de cores...',
          backdropDismiss: false,
          keyboardClose: false,
          spinner: 'bubbles',
          duration: 900,
        }).then((l: any) => {
          l.present();
        });
        console.log(response);
        switch (response) {
          case 'escuro':
            document.body.setAttribute('data-theme', 'dark');
            this.toastsService.showToast('Modo escuro ativado.');
            break;
          case 'claro':
            document.body.removeAttribute('data-theme');
            this.toastsService.showToast('Modo escuro desativado.');
            break;
          default:
            if (this.platform.is('cordova')) {
              this.platform.ready().then(() => {
                this.changeTheme().then();
              });
            }
            break;
        }
      }
    );
  }

  async changeTheme(): Promise<void> {
    const isAvailable = await this.themeDetection.isAvailable();
    if (isAvailable && isAvailable.value) {
      const isDarkModeEnabled = await this.themeDetection.isDarkModeEnabled();
      if (isDarkModeEnabled.value) {
        document.body.setAttribute('data-theme', 'dark');
        this.toastsService.showToast('Modo escuro automatico.');
      }
    }
  }
}
