import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DadosService} from '../../../core/services/dados.service';
import {Dia} from '../../../core/models/dia';
import {getHours, getMinutes, parseISO} from 'date-fns';

@Component({
  selector: 'app-modal-hora-extra',
  templateUrl: './modal-hora-extra.component.html',
  styleUrls: ['./modal-hora-extra.component.scss']
})
export class ModalHoraExtraComponent implements OnInit {

  @Input() dados: Dia;

  form: FormGroup;

  constructor(
    private dadosService: DadosService,
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      reason: [null, [Validators.required, Validators.minLength(4)]],
      status: ['em_analise', [Validators.required]],
      status_display: ['Em análise', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  getTipo(): 'hora_extra' | 'falta' {
    const producao: Date = parseISO(this.dados.production);
    const horas: number = getHours(producao);
    const minutos: number = getMinutes(producao);
    if (horas > 0 || minutos > 0) {
      return 'hora_extra';
    }
    return 'falta';
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }

  cancelar(): void {
    this.modalController.dismiss({
      success: false
    }).catch();
  }

  salvar(): void {
    if (this.form.valid) {
      // const data: string = format(this.formatDate(this.dados.date), 'yyyy-MM-dd');
      // this.dadosService.solicitarHoraExtra(data, this.form.value).subscribe(
      //   response => {
      //     // this.modalController.dismiss({
      //     //   success: true,
      //     //   data: {teste: true}
      //     // });
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // );
      this.modalController.dismiss({
        success: true,
        data: {teste: true}
      }).catch();
    }
  }
}
