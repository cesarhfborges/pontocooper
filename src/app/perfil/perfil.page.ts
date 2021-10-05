import {Component, OnInit} from '@angular/core';
import {AuthService} from '../core/services/auth.service';
import {Budget, Usuario} from '../core/models/usuario';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfil: Usuario;

  showAmount = false;

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
}
