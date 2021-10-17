import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {ToastsService} from '../shared/service/toasts.service';
import {Platform} from '@ionic/angular';

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
  ) {
    this.form = this.fb.group({
      darkMode: this.fb.control(null, [Validators.required]),
      loginRemember: this.fb.control(null, [Validators.required]),
    });
    const opcoes: any = localStorage.getItem('opcoes');
    this.form.patchValue(JSON.parse(opcoes));
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(
      response => {
        localStorage.setItem('opcoes', JSON.stringify(response));
        switch (response.darkMode) {
          case 'escuro':
            document.body.setAttribute('data-theme', 'dark');
            break;
          case 'claro':
            document.body.removeAttribute('data-theme');
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
        this.toastsService.showToast(isDarkModeEnabled.value ? 'Modo escuro ativo.' : 'Modo escuro inativo.');
      }
    }
  }
}
