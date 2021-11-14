import {Component} from '@angular/core';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {Platform} from '@ionic/angular';
import {ToastsService} from './shared/services/toasts.service';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import { AndroidShortcuts } from 'capacitor-android-shortcuts';
import npm from '../../package.json';
import {AuthService} from './core/services/auth.service';
import {Router} from '@angular/router';

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
    private themeDetection: ThemeDetection,
    private toastsService: ToastsService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.platform.is('cordova')) {
      this.addShortCut().then();
      this.lockScreen().then();
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

  async lockScreen(): Promise<void> {
    await this.platform.ready();
    if (this.platform.is('cordova')) {
      await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  async addShortCut(): Promise<void> {
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
      await AndroidShortcuts.addListener('shortcut', listen => {
        if (listen.data) {
          this.router.navigate([`${listen.data}`]);
        }
      });
    }
  }
}
