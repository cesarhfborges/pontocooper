import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {map, mergeMap, toArray} from 'rxjs/operators';
import {parseISO} from 'date-fns';
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

  ngOnInit() {
    this.getPeriodosFeriasAbonos();
    this.getPeriodosDados();
  }

  getPeriodosDados(): void {
    this.loading.periodos = true;
    this.dadosService.getPeriodosDados().subscribe(
      response => {
        console.log('getPeriodosDados', response);
        this.paidLeave = response;
        this.loading.periodos = false;
      },
      error => {
        console.log(error);
        this.loading.periodos = false;
      }
    );
  }

  getPeriodosFeriasAbonos(): void {
    this.loading.feriasAbonos = true;
    this.dadosService.getPeriodosFeriasAbonos().pipe(
      mergeMap((i: Array<any>) => i),
      map((item: Array<string>) => item.map(i => parseISO(i))),
      toArray()
    ).subscribe(
      response => {
        console.log('getPeriodosFeriasAbonos: ', response);
        this.periodos = response.map(i => ({de: i[0], ate: i[1]}));
        this.form.patchValue({
          periodo: this.periodos[0]
        });
        this.loading.feriasAbonos = false;
      },
      error => {
        console.log(error);
        this.loading.feriasAbonos = false;
      }
    );
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
