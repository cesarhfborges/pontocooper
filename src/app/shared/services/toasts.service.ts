import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(
    private toastController: ToastController,
  ) {
  }

  showToast(mensagem: string): void {
    this.toastController.create({
      message: mensagem,
      duration: 2000,
      animated: true,
    }).then(
      toast => {
        toast.present().then();
      }
    );
  }

  showToastDanger(mensagem: string): void {
    this.toastController.create({
      message: mensagem,
      duration: 3000,
      animated: true,
      color: 'danger'
    }).then(
      toast => {
        toast.present().then();
      }
    );
  }

  showToastSuccess(mensagem: string): void {
    this.toastController.create({
      message: mensagem,
      duration: 2000,
      animated: true,
      color: 'success'
    }).then(
      toast => {
        toast.present().then();
      }
    );
  }

  showToastWarning(mensagem: string): void {
    this.toastController.create({
      message: mensagem,
      duration: 3000,
      animated: true,
      color: 'warning'
    }).then(
      toast => {
        toast.present().then();
      }
    );
  }
}
