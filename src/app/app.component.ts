import {Component} from '@angular/core';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {LoadingController, Platform, ToastController} from '@ionic/angular';
import {ToastsService} from './shared/services/toasts.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {AuthService} from './core/services/auth.service';
import {Router} from '@angular/router';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {BackgroundMode} from '@awesome-cordova-plugins/background-mode/ngx';
import {DadosService} from './core/services/dados.service';
import {AndroidShortcuts} from 'capacitor-android-shortcuts';
import {App} from '@capacitor/app';
import {delay} from 'rxjs/operators';
import npm from '../../package.json';
import {Geolocation, GeolocationOptions} from '@ionic-native/geolocation/ngx';
import {parseISO} from 'date-fns';
import {Ponto} from './core/models/ponto';
import {Batida} from './core/models/batida';
import {environment} from '../environments/environment';

interface Menu {
  label: string;
  link: string;
  icon?: string;
  visible: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  devMode = false;

  versao = npm.version;

  menus: Array<Menu> = [
    {
      label: 'Home',
      link: '/home',
      icon: 'planet',
      visible: true
    },
    {
      label: 'Produção',
      link: '/producao',
      icon: 'calendar-outline',
      visible: true
    },
    {
      label: 'Histórico (GPS)',
      link: '/historico',
      icon: 'navigate-outline',
      visible: true
    },
    {
      label: 'Férias e Abonos',
      link: '/ferias-abonos',
      icon: 'planet-outline',
      visible: true
    },
    {
      label: 'Ausências e Horas extras',
      link: '/ausencias-horas-extras',
      icon: 'planet-outline',
      visible: true
    },
    {
      label: 'Opções',
      link: '/opcoes',
      icon: 'settings-outline',
      visible: true
    },
    {
      label: 'Perfil',
      link: '/perfil',
      icon: 'person-outline',
      visible: true
    },
    {
      label: 'Dev',
      link: '/testes',
      icon: 'code-working-outline',
      visible: !environment.production
    }
  ];

  constructor(
    private dadosService: DadosService,
    private themeDetection: ThemeDetection,
    private toastsService: ToastsService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
  ) {
    if (this.platform.is('cordova')) {
      this.backgroundMode.setDefaults({
        title: 'Cooper System',
        text: 'Cooper System está em execução',
        silent: false,
        hidden: false,
        resume: false,
      });
      this.addDynamicShortCuts().catch();
      // this.addPinnedShortCuts().catch();
      this.listenShortCuts().catch();
      this.lockScreenOrientation().catch();
      this.permissaoNotif().catch();
      this.backgroundMode.un('enable', () => {
        console.log('============== backgroundMode activate ==============');
      });
      this.backgroundMode.disableBatteryOptimizations();
      // this.backgroundMode.enable();
    }
    const darkMode: any = JSON.parse(localStorage.getItem('opcoes')).darkMode;
    switch (darkMode) {
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
    this.appFocusChange();
  }

  async changeTheme(): Promise<void> {
    const isAvailable = await this.themeDetection.isAvailable();
    if (isAvailable && isAvailable.value) {
      const isDarkModeEnabled = await this.themeDetection.isDarkModeEnabled();
      if (isDarkModeEnabled.value) {
        document.body.setAttribute('data-theme', 'dark');
      }
    }
  }

  async permissaoNotif(): Promise<void> {
    if (!await this.localNotifications.hasPermission()) {
      await this.localNotifications.requestPermission();
    }
    return Promise.resolve();
  }

  async lockScreenOrientation(): Promise<void> {
    await this.platform.ready();
    if (this.platform.is('cordova')) {
      await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    return Promise.resolve();
  }

  private async addPinnedShortCuts() {
    const {result} = await AndroidShortcuts.isPinnedSupported();
    if (result) {

    }
    return Promise.resolve();
  }

  private async addDynamicShortCuts(): Promise<void> {
    const {result} = await AndroidShortcuts.isDynamicSupported();
    if (result) {
      await AndroidShortcuts.addDynamic({
        items: [
          {
            id: 'ponto',
            shortLabel: 'Bater Ponto',
            longLabel: 'Registrar ponto',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'ponto',
          },
          {
            id: 'producao',
            shortLabel: 'Minha produção',
            longLabel: 'Minha produção',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'producao',
          },
          {
            id: 'historico',
            shortLabel: 'Histórico(GPS)',
            longLabel: 'Histórico(GPS)',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'historico',
          },
          {
            id: 'ferias-abonos',
            shortLabel: 'Férias e abonos',
            longLabel: 'Férias e abonos',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'ferias-abonos',
          },
          {
            id: 'perfil',
            shortLabel: 'Perfil',
            longLabel: 'Perfil',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'perfil',
          },
        ],
      });
    }
    return Promise.resolve();
  }

  private appFocusChange() {
    App.addListener('appStateChange', ({isActive}) => {
      if (this.authService.isAuthenticated() && this.authService.tokenExpired() && isActive) {
        this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Aguarde...',
          backdropDismiss: false,
          keyboardClose: false,
          showBackdrop: true,
          animated: true,
          spinner: 'bubbles',
        }).then((l: any) => {
          l.present();
          this.authService.refreshToken(this.authService.getRefreshToken())
            .pipe(delay(900))
            .subscribe(
              () => {
                l.dismiss();
              },
              () => {
                l.dismiss();
              }
            );
        });
      }
    });
  }

  private async listenShortCuts() {
    const dynamicSupported = await AndroidShortcuts.isDynamicSupported();
    const pinnedSupported = await AndroidShortcuts.isPinnedSupported();
    if (dynamicSupported.result || pinnedSupported.result) {
      await AndroidShortcuts.addListener('shortcut', async listen => {
        this.router.navigate([`${listen.data}`]).catch();
      });
    }
  }
}
