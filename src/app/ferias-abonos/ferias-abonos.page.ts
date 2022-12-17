import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {distinctUntilChanged, map, mergeMap, toArray} from 'rxjs/operators';
import {format, parseISO, set} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {SolicitarDescansoComponent} from '../shared/components/solicitar-descanso/solicitar-descanso.component';

interface Balance {
  days_off: {
    obtained: number;
    approved: number;
    remaining: number;
  };
  annual_leaves: {
    obtained: number;
    approved: number;
    remaining: number;
  };
}

interface MonthsProportions {
  month: {
    month_id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    month_display:
      'January' |
      'February' |
      'March' |
      'April' |
      'May' |
      'June' |
      'July' |
      'August' |
      'September' |
      'October' |
      'November' |
      'December';
  };
  obteined: number;
  propotion: number;
}

interface Periodo {
  id: number;
  first_name: string;
  last_name: string;
  timeline: {
    start_date: Date | string;
    end_date: Date | string;
    situation: 'ACTUAL' | string;
    history: [];
    balance: Balance[];
    months_proportions: MonthsProportions[];
  };
}

@Component({
  selector: 'app-ferias-abonos',
  templateUrl: './ferias-abonos.page.html',
  styleUrls: ['./ferias-abonos.page.scss'],
})
export class FeriasAbonosPage implements OnInit {

  paidLeave: Periodo;

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
      const periodos = await this.getPeriodos();
      await this.getPeriodosDados(this.form.get('periodo').value.de);
    } catch (e) {
      console.log(e);
    }
  }

  async getPeriodos(): Promise<any> {
    return this.dadosService.getPeriodos().toPromise();
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
      this.periodos = response.map(i => ({de: i[0], ate: i[1]}));
      this.form.patchValue({
        periodo: this.periodos[0]
      });
      this.loading.feriasAbonos = false;
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  }

  getPeriodo(): Periodo {
    if (this.paidLeave) {
      return this.paidLeave;
    }
    return null;
  }

  getMonth(date: string): Date {
    return parseISO(date);
  }

  getMonthFromId(month_id: number): Date {
    return set(new Date(), {date: 0, month: month_id, hours: 0, minutes: 0, seconds: 0, milliseconds: 0,});
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
        selecionado: this.form.get('periodo').value,
        abono: this.getPeriodo()?.timeline?.balance[0]?.days_off.remaining,
        ferias: this.getPeriodo()?.timeline?.balance[0]?.annual_leaves.remaining
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data?.success) {
      // this.toastsService.showToastSuccess('Hora(s) extra(s), solicitada(s) com sucesso.');
      // this.getProducao();
    }
  }
}
