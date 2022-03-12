import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {ToastsService} from '../shared/services/toasts.service';
import {LoadingController, Platform} from '@ionic/angular';
import {DownloadService} from '../core/services/download.service';
import {FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {Update} from '../core/models/update';
import npm from '../../../package.json';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit, AfterViewInit {

  atualizacao: Update;
  atualizacaoDisponivel = false;

  loading = true;

  opcoes: {
    darkMode: Array<{ label: string; value: 'automatico' | 'escuro' | 'claro' }>;
    loginRemember: Array<{ label: string; value: boolean }>;
    intervalo: Array<{ label: string; value: number }>;
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
    ],
    intervalo: [
      {value: 30, label: '00:30'},
      {value: 45, label: '00:45'},
      {value: 60, label: '01:00'},
      {value: 90, label: '01:30'},
      {value: 120, label: '02:00'},
    ]
  };

  form: FormGroup;
  versaoApp = '';
  plataforma = false;

  constructor(
    private fb: FormBuilder,
    private themeDetection: ThemeDetection,
    private toastsService: ToastsService,
    private platform: Platform,
    private loadingController: LoadingController,
    private downloadService: DownloadService,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener
  ) {
    this.plataforma = this.platform.is('cordova');
    this.form = this.fb.group({
      darkMode: this.fb.control('automatico', [Validators.required]),
      loginRemember: this.fb.control(false, [Validators.required]),
      valorAcumulado: this.fb.control(false, [Validators.required]),
      intervalo: this.fb.control(30, [Validators.required, Validators.min(30)]),
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
          showBackdrop: true,
          animated: true,
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

  async checkUpdate() {
    try {
      this.loading = true;
      const versaoApp: Array<number> = npm.version.split('.').map(n => Number(n));
      const data: any = await this.downloadService.getAppVersion().pipe(delay(2500)).toPromise();
      const versaoAtual: Array<number> = data.version.split('.').map(n => Number(n));
      for (let i = 0; i < versaoAtual.length; i++) {
        if (versaoAtual[i] > versaoApp[i]) {
          this.atualizacaoDisponivel = true;
          break;
        }
      }
      this.versaoApp = data.version;
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }

  async download() {
    try {
      this.atualizacao = new Update(this.transfer.create(), this.file.dataDirectory);
      const response = await this.atualizacao.download();
      const open = await this.fileOpener.open(response.nativeURL, 'application/vnd.android.package-archive');
      console.log(open);
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewInit(): void {
    this.checkUpdate().catch();
  }
}
