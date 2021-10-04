import { Component, OnInit } from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {AlertController, Platform} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-producao',
  templateUrl: './producao.page.html',
  styleUrls: ['./producao.page.scss'],
})
export class ProducaoPage implements OnInit {

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
  ) { }

  ngOnInit() {
  }

  sair(): void {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseja confirmar Saída?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    }).then((alert: any) => {
      alert.present();
    });
  }
}
