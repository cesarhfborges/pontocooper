import {Component} from '@angular/core';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {Platform} from '@ionic/angular';
import {ToastsService} from './shared/service/toasts.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menus: Array<{ label: string; link: string; }> = [
    {
      label: 'Home',
      link: '/home'
    },
    {
      label: 'Produção',
      link: '/producao'
    },
    {
      label: 'Histórico (GPS)',
      link: '/historico'
    },
    {
      label: 'Férias e Abonos',
      link: '/ferias-abonos'
    },
    {
      label: 'Opções',
      link: '/opcoes'
    },
    {
      label: 'Perfil',
      link: '/perfil'
    }
  ];

  constructor(
    private themeDetection: ThemeDetection,
    private toastsService: ToastsService,
    private platform: Platform,
  ) {
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
}
