import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Menu } from './menu';
import {IonRouterOutlet, Platform} from '@ionic/angular';
import {App} from '@capacitor/app';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent  implements OnInit {

  versao = '0.0.0';

  swipe = false;

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
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
  ) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp().catch();
      }
    });
  }

}
