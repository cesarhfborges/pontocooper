import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {addDays, addYears, format} from 'date-fns';

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
    min: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    max: format(addYears(new Date(), 4), 'yyyy-MM-dd'),
  };

  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      tipo: ['ferias', [Validators.required]],
      periodo: [null, [Validators.required]],
      duracao: [null, [Validators.required]],
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

  salvar(): void {
  }
}
