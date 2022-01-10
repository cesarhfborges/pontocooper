import {Component} from '@angular/core';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {LoadingController, Platform} from '@ionic/angular';
import {ToastsService} from './shared/services/toasts.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {AuthService} from './core/services/auth.service';
import {Router} from '@angular/router';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {AndroidShortcuts} from 'capacitor-android-shortcuts';
import {App} from '@capacitor/app';
import {delay} from 'rxjs/operators';
import npm from '../../package.json';
import {DadosService} from './core/services/dados.service';

interface Menu {
  label: string;
  link: string;
  icon?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  versao = npm.version;

  menus: Array<Menu> = [
    {
      label: 'Home',
      link: '/home',
      icon: 'planet'
    },
    {
      label: 'Produção',
      link: '/producao',
      icon: 'calendar-outline'
    },
    {
      label: 'Histórico (GPS)',
      link: '/historico',
      icon: 'navigate-outline'
    },
    {
      label: 'Férias e Abonos',
      link: '/ferias-abonos',
      icon: 'planet-outline'
    },
    {
      label: 'Opções',
      link: '/opcoes',
      icon: 'settings-outline'
    },
    {
      label: 'Perfil',
      link: '/perfil',
      icon: 'person-outline'
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
    private localNotifications: LocalNotifications
  ) {
    if (this.platform.is('cordova')) {
      this.addDynamicShortCuts().catch();
      this.addPinnedShortCuts().catch();
      this.listenShortCuts().catch();
      this.lockScreen().catch();
      this.permissaoNotif().catch();
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
        this.toastsService.showToast(isDarkModeEnabled.value ? 'Modo escuro ativo.' : 'Modo escuro inativo.');
      }
    }
  }

  async permissaoNotif(): Promise<void> {
    if (!await this.localNotifications.hasPermission()) {
      await this.localNotifications.requestPermission();
    }
    return Promise.resolve();
  }

  async lockScreen(): Promise<void> {
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
            id: 'opcoes',
            shortLabel: 'Opções',
            longLabel: 'Opções',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'opcoes',
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
      await AndroidShortcuts.addListener('shortcut', listen => {
        console.log('LISTEN: ', listen);
        if (listen.data === 'ponto') {
          // const response: any = await this.dadosService.baterPonto({
          //   check_in: !this.ponto.trabalhando,
          //   latitude: this.coords.lat,
          //   longitude: this.coords.lon
          // }).toPromise();
          // this.router.navigate([`/home`], {state: {registrar: true}, skipLocationChange: false});
        } else if (listen.data) {
          this.router.navigate([`${listen.data}`]);
        }
      });
    }
  }
}
