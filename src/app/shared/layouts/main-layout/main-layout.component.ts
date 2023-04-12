import {AfterViewInit, Component, OnInit} from '@angular/core';
import {IonRouterOutlet, Platform} from '@ionic/angular';
import {environment} from 'src/environments/environment';
import {Menu} from './menu';
import {AuthService} from '../../../core/services/auth.service';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, AfterViewInit {

  versao = '0.0.0';

  swipe = true;

  menus: Array<Menu> = [
    {
      label: 'Home',
      link: 'home',
      icon: 'planet',
      visible: true
    },
    {
      label: 'Produção',
      link: 'producao',
      icon: 'calendar-outline',
      visible: true
    },
    {
      label: 'Histórico (GPS)',
      link: 'historico',
      icon: 'navigate-outline',
      visible: true
    },
    {
      label: 'Férias e Abonos',
      link: 'ferias-abonos',
      icon: 'planet-outline',
      visible: false
    },
    {
      label: 'Ausências e Horas extras',
      link: 'ausencias-horas-extras',
      icon: 'planet-outline',
      visible: false
    },
    {
      label: 'Opções',
      link: 'opcoes',
      icon: 'settings-outline',
      visible: false
    },
    {
      label: 'Perfil',
      link: 'profile',
      icon: 'person-outline',
      visible: true
    },
    {
      label: 'Dev',
      link: 'testes',
      icon: 'code-working-outline',
      visible: !environment.production && false
    }
  ];

  constructor(
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      // if (!this.routerOutlet.canGoBack()) {
      //   App.exitApp().catch();
      // }
    });
  }

  ngAfterViewInit(): void {
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        if (this.platform.is('android')) {
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setBackgroundColor({color: '#178865'});
          const info = await StatusBar.getInfo();
          console.log('statusBar info: ', info);
        }
      }

      // this.platform.is('cordova');
      // this.statusBar.overlaysWebView(false);
      // this.statusBar.backgroundColorByHexString('#178865');
      // this.getCoords().then(r => {
      //   this.coords = r;
      // });
    }).catch(e => {
    });
  }
}
