import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {addYears, format, parseISO} from 'date-fns';
import {DadosService} from '../../../core/services/dados.service';

interface Detalhes {
  approved: number;
  obtained: number;
  remaining: number;
}

@Component({
  selector: 'app-solicitar-descanso',
  templateUrl: './solicitar-descanso.component.html',
  styleUrls: ['./solicitar-descanso.component.scss'],
})
export class SolicitarDescansoComponent implements OnInit {

  @Input() periodos: Array<{ de: Date; ate: Date }>;
  @Input() abono = 0;
  @Input() ferias = 0;

  hoje: string = format(new Date(), 'yyyy-MM-dd');
  dt = {
    min: format(new Date(), 'yyyy-MM-dd'),
    max: format(addYears(new Date(), 4), 'yyyy-MM-dd'),
  };

  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private dadosService: DadosService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      tipo: ['abono', [Validators.required]],
      periodo: [null, [Validators.required]],
      duracao: ['00:00', [Validators.required]],
      justificativa: [null, [Validators.required]],
    });
  }

  get tipo(): string {
    return this.form.get('tipo').value;
  }

  set tipo(tipo: string) {
    this.form.get('tipo').patchValue(tipo);
  }

  ngOnInit() {
  }

  async cancelar() {
    await this.modalController.dismiss({
      success: false
    });
  }

  async salvar() {
    await this.modalController.dismiss({
      success: true
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const seila = {
        date: format(parseISO(this.form.get('periodo').value), 'YYYY-MM-dd'),
        hours: this.form.get('duracao').value + ':00',
        reason: this.form.get('justificativa').value,
        request_type: this.form.get('tipo').value,
      };
      this.dadosService.solicitarAusencia([seila]).subscribe(
        response => {
          this.salvar().catch();
        },
        error => {
          console.log(error);
        }
      );
    } else {
      console.log('invalid');
    }
  }
}
