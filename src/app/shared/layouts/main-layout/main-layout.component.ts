import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Menu } from './menu';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent  implements OnInit {

  versao = '0.0.0';

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

  constructor() { }

  ngOnInit() {}

}
