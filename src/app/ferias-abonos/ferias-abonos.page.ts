import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {map, mergeMap, toArray} from 'rxjs/operators';
import {format, parseISO} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {SolicitarDescansoComponent} from '../shared/components/solicitar-descanso/solicitar-descanso.component';

interface Periodo {
  balance: {
    annual_leaves: {
      approved: number;
      obtained: number;
      remaining: number;
    };
    days_off: {
      approved: number;
      obtained: number;
      remaining: number;
    };
  };
  history: Array<any>;
  reference_period_start: string;
  timeline: Array<{
    date: string;
    days: number;
  }>;
}

@Component({
  selector: 'app-ferias-abonos',
  templateUrl: './ferias-abonos.page.html',
  styleUrls: ['./ferias-abonos.page.scss'],
})
export class FeriasAbonosPage implements OnInit {

  paidLeave: Array<Periodo>;

  loading: {
    periodos: boolean;
    feriasAbonos: boolean;
  } = {
    periodos: false,
    feriasAbonos: false
  };

  periodos: Array<{ de: Date; ate: Date }>;

  form: FormGroup;

  constructor(
    private dadosService: DadosService,
    private fb: FormBuilder,
    private modalController: ModalController
  ) {
    this.form = this.fb.group({
      periodo: [null, Validators.required]
    });
  }

  async ngOnInit() {
    try {
      await this.getPeriodosFeriasAbonos();
      await this.getPeriodosDados(this.periodos[this.periodos.length - 1].de);
    } catch (e) {
      console.log(e);
    }
  }

  async getPeriodosDados(data: Date) {
    try {
      this.loading.periodos = true;
      this.paidLeave = await this.dadosService.getPeriodosDados(format(data, 'yyyy-MM-dd')).toPromise();
      this.loading.periodos = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  }

  async getPeriodosFeriasAbonos() {
    try {
      this.loading.feriasAbonos = true;
      const response = await this.dadosService.getPeriodosFeriasAbonos().pipe(
        mergeMap((i: Array<any>) => i),
        map((item: Array<string>) => item.map(i => parseISO(i))),
        toArray()
      ).toPromise();
      console.log('getPeriodosFeriasAbonos: ', response);
      this.periodos = response.map(i => ({de: i[0], ate: i[1]}));
      this.form.patchValue({
        periodo: this.periodos[this.periodos.length - 1]
      });
      this.loading.feriasAbonos = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  }

  getPeriodo(i: number = 0): Periodo {
    if (this.paidLeave?.length > 0) {
      return this.paidLeave[0];
    }
    return null;
  }

  getMonth(date: string): Date {
    return parseISO(date);
  }

  async modalSolicitarDescanso() {
    const modal = await this.modalController.create({
      component: SolicitarDescansoComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      backdropDismiss: false,
      keyboardClose: false,
      animated: true,
      componentProps: {
        periodos: this.periodos,
        selecionado: {de: this.form.get('periodo').value},
        abono: this.getPeriodo().balance.days_off.remaining,
        ferias: this.getPeriodo().balance.annual_leaves.remaining
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    console.log(data);
    if (data?.success) {
      // this.toastsService.showToastSuccess('Hora(s) extra(s), solicitada(s) com sucesso.');
      // this.getProducao();
    }
  }
}
