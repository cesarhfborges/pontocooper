import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {IonRouterOutlet, Platform} from '@ionic/angular';
import {environment} from 'src/environments/environment';
import {Menu} from './menu';
import {AuthService} from '../../../core/services/auth.service';
import {Animation, StatusBar, Style} from '@capacitor/status-bar';
import {PositionService} from '../../services/position.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, AfterViewInit, AfterContentInit {

  versao = environment.appVersion;

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
    private positionService: PositionService,
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
          await StatusBar.show({animation: Animation.Fade});
          await StatusBar.setBackgroundColor({color: '#178865'});
          await StatusBar.setStyle({style: Style.Dark});
        }
        if (this.platform.is('ios')) {
          // await StatusBar.show({animation: Animation.Slide});
          // await StatusBar.setStyle({style: Style.Dark});
          // await StatusBar.setBackgroundColor({color: '#178865'});
        }
      }
    }).catch(e => {
    });
  }

  ngAfterContentInit(): void {
    this.positionService.requestPermissions().catch();
    // console.log('=============================================================');
    // console.log('ngAfterContentInit');
    // const permissionsPosition = async () => {
    //   const permissions = await Geolocation.checkPermissions();
    //   console.log('permissions: ', permissions);
    //   if (permissions.location === 'prompt' || permissions.coarseLocation === 'prompt') {
    //     const options: GeolocationPluginPermissions = {
    //       permissions: [
    //         'location',
    //         'coarseLocation'
    //       ]
    //     };
    //     const requestPermissions = await Geolocation.requestPermissions(options);
    //     console.log('requestPermissions: ', requestPermissions);
    //   }
    //   const coordinates = await Geolocation.getCurrentPosition();
    //   console.log('Current position: ', coordinates);
    // };
    // permissionsPosition().catch();
    // console.log('=============================================================');
  }
}
