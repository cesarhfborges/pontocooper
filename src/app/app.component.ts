import {Component} from '@angular/core';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {Platform, ToastController} from '@ionic/angular';

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
    private toastController: ToastController,
    private platform: Platform,
  ) {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.changeTheme().then();
      });
    }
  }

  async presentToast(mensagem: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000
    });
    await toast.present();
    return await Promise.resolve();
  }

  async changeTheme(): Promise<void> {
    const isAvailable = await this.themeDetection.isAvailable();
    if (isAvailable && isAvailable.value) {
      const isDarkModeEnabled = await this.themeDetection.isDarkModeEnabled();
      if (isDarkModeEnabled.value) {
        document.body.setAttribute('data-theme', 'dark');
        this.presentToast(isDarkModeEnabled.value ? 'Modo escuro ativo.' : 'Modo escuro inativo.').then();
      }
    }
  }
}
