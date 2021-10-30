import {Component, OnInit} from '@angular/core';
import {AuthService} from '../core/services/auth.service';
import {Usuario} from '../core/models/usuario';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfil: Usuario;

  showAmount = false;
  // eslint-disable-next-line max-len
  avatar = 'https://icons-for-free.com/iconfiles/png/512/avatar+human+male+man+men+people+person+profile+user+users-1320196163635839021.png';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.getPerfil();
  }

  getPerfil(): void {
    this.authService.perfil().subscribe(
      response => {
        this.perfil = response;
        this.getImage(response.avatar);
      },
      error => {
        console.log(error);
      }
    );
  }

  toggleAmount(): void {
    this.showAmount = !this.showAmount;
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

  getImage(url): void {
    const request = new XMLHttpRequest();
    request.responseType = 'blob';
    request.onload = () => {
      if (request.status === 200) {
        this.avatar = url;
      }
    };
    request.open('GET', url, true);
    request.send();
  }
}
