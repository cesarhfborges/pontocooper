import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Menu } from './menu';
import { Animation, StatusBar, Style } from '@capacitor/status-bar';
import { PositionService } from '../../services/position.service';
import { LocalNotifications } from '@capacitor/local-notifications';

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
      link: '/home',
      icon: 'planet',
      visible: true,
    },
    {
      label: 'Produção',
      link: '/producao',
      icon: 'calendar-outline',
      visible: true,
    },
    {
      label: 'Histórico (GPS)',
      link: '/historico',
      icon: 'navigate-outline',
      visible: true,
    },
    {
      label: 'Férias e Abonos',
      link: '/ferias-abonos',
      icon: 'planet-outline',
      visible: false,
    },
    {
      label: 'Ausências e Horas extras',
      link: '/ausencias-horas-extras',
      icon: 'planet-outline',
      visible: false,
    },
    {
      label: 'Opções',
      link: '/opcoes',
      icon: 'settings-outline',
      visible: false,
    },
    {
      label: 'Perfil',
      link: '/profile',
      icon: 'person-outline',
      visible: true,
    },
    {
      label: 'Opções',
      link: '/opcoes',
      icon: 'settings-outline',
      visible: true,
    },
    {
      label: 'Dev',
      link: '/development',
      icon: 'code-working-outline',
      visible: !environment.production,
    },
  ];

  constructor(
    private platform: Platform,
    private positionService: PositionService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        if (this.platform.is('android')) {
          await StatusBar.setOverlaysWebView({overlay: false});
          await StatusBar.show({animation: Animation.Fade});
          await StatusBar.setBackgroundColor({color: '#178865'});
          await StatusBar.setStyle({style: Style.Dark});
        }
        if (this.platform.is('ios')) {
          await StatusBar.setBackgroundColor({color: '#1da57a'});
          await StatusBar.setStyle({style: Style.Dark});
        }
      }
    }).catch(e => {
    });
  }

  ngAfterContentInit(): void {
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        this.positionService.requestPermissions().catch();
        if (this.platform.is('android') || this.platform.is('ios')) {
          this.createNotificationsChannel().catch();
        }
      }
    });
  }

  async createNotificationsChannel() {
    const permissionStatus = await LocalNotifications.checkPermissions();
    if (['prompt', 'prompt-with-rationale'].includes(permissionStatus.display)) {
      await LocalNotifications.requestPermissions();
    }
    if (permissionStatus.display === 'granted') {
      const channels = await LocalNotifications.listChannels();
      const pontoChannel = channels.channels.find(i => i.id === 'ponto');
      if (!pontoChannel) {
        await LocalNotifications.createChannel({
          id: 'ponto',
          name: 'Ponto',
          vibration: true,
          importance: 5,
          sound: 'cool.wav',
          lights: true,
          description: 'canal de notificações para ponto eletronico.',
          visibility: 1,
        });
      }
    }
  }
}
