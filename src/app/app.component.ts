import {Component} from '@angular/core';
import {ThemeDetection} from '@ionic-native/theme-detection/ngx';
import {ThemeDetectionResponse} from '@ionic-native/theme-detection';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menus: Array<{label: string; link: string;}> = [
    {
      label: 'Home',
      link: '/home'
    },
    {
      label: 'Produção',
      link: '/producao'
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
  ) {
    this.themeDetection.isAvailable().then((res: ThemeDetectionResponse) => {
      if (res.value) {
        this.themeDetection.isDarkModeEnabled().then((r: ThemeDetectionResponse) => {
          if (r.value) {
            document.body.setAttribute('data-theme', 'dark');
            this.presentToast(res.value ? 'Dark mode ativo' : 'Dark mode inativo').then();
          }
        }).catch(e => {});
      }
    }).catch(e => {});
  }

  async presentToast(mensagem: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000
    });
    await toast.present();
    return await Promise.resolve();
  }
}
