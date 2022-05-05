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
      label: 'Ausências e Horas extras',
      link: '/ausencias-horas-extras',
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
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    private geolocation: Geolocation,
    private toastController: ToastController,
  ) {
    if (this.platform.is('cordova')) {
      this.addDynamicShortCuts().catch();
      // this.addPinnedShortCuts().catch();
      this.listenShortCuts().catch();
      this.lockScreen().catch();
      this.permissaoNotif().catch();
      this.backgroundMode.setDefaults({silent: true, resume: true, hidden: false});
      this.backgroundMode.enable();
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
            id: 'ponto',
            shortLabel: 'Bater Ponto',
            longLabel: 'Registrar ponto',
            icon: {
              type: 'Bitmap',
              name: 'aaa'
            },
            data: 'ponto',
          },
          // {
          //   id: 'producao',
          //   shortLabel: 'Minha produção',
          //   longLabel: 'Minha produção',
          //   icon: {
          //     type: 'Bitmap',
          //     name: 'aaa'
          //   },
          //   data: 'producao',
          // },
          // {
          //   id: 'historico',
          //   shortLabel: 'Histórico(GPS)',
          //   longLabel: 'Histórico(GPS)',
          //   icon: {
          //     type: 'Bitmap',
          //     name: 'aaa'
          //   },
          //   data: 'historico',
          // },
          // {
          //   id: 'ferias-abonos',
          //   shortLabel: 'Férias e abonos',
          //   longLabel: 'Férias e abonos',
          //   icon: {
          //     type: 'Bitmap',
          //     name: 'aaa'
          //   },
          //   data: 'ferias-abonos',
          // },
          // {
          //   id: 'opcoes',
          //   shortLabel: 'Opções',
          //   longLabel: 'Opções',
          //   icon: {
          //     type: 'Bitmap',
          //     name: 'aaa'
          //   },
          //   data: 'opcoes',
          // },
          // {
          //   id: 'perfil',
          //   shortLabel: 'Perfil',
          //   longLabel: 'Perfil',
          //   icon: {
          //     type: 'Bitmap',
          //     name: 'aaa'
          //   },
          //   data: 'perfil',
          // },
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
        if (listen.data === 'ponto') {
          const loading = await this.loadingScreen('Aguarde registrando ponto...');
          await loading.present();
          const ponto: Ponto = new Ponto([]);
          const timeline = await this.dadosService.getTimeline().toPromise();
          for (const batida of timeline.timeline) {
            ponto.addPonto({
              ...batida,
              worktime_clock: parseISO(batida.worktime_clock)
            });
          }
          const {latitude, longitude} = await this.getCoords();
          const response: any = await this.dadosService.baterPonto({
            check_in: !ponto.trabalhando,
            latitude: latitude ?? -15.7962774,
            longitude: longitude ?? -47.9481004
          }).pipe(delay(1800)).toPromise();
          await loading.dismiss();
          const toast: any = await this.toastController.create({
            message: `${ponto.trabalhando ? 'Entrada' : 'Saída'} registrada com sucesso!`,
            duration: 3000,
            color: 'success',
          });
          toast.present();
          await this.router.navigate([`/login`], {skipLocationChange: false});
        } else if (listen.data) {
          this.router.navigate([`${listen.data}`]).catch();
        }
      });
    }
  }

  private async loadingScreen(message = 'Aguarde...') {
    return await this.loadingController.create({
      message,
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      showBackdrop: true,
      animated: true,
      keyboardClose: false,
      spinner: 'bubbles',
    });
  }

  private async getCoords(): Promise<{ latitude: number; longitude: number }> {
    try {
      const opts: GeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
      };
      const {coords} = await this.geolocation.getCurrentPosition();
      return coords;
    } catch (e) {
      return {
        latitude: -15.7962774,
        longitude: -47.9481004
      };
    }
  }
}
