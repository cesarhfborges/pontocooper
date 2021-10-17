import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {map, mergeMap, toArray} from 'rxjs/operators';
import {parseISO} from 'date-fns';

@Component({
  selector: 'app-ferias-abonos',
  templateUrl: './ferias-abonos.page.html',
  styleUrls: ['./ferias-abonos.page.scss'],
})
export class FeriasAbonosPage implements OnInit {

  paidLeave: Array<any>;

  loading: {
    periodos: boolean;
  } = {
    periodos: false,
  };

  periodos: Array<Array<Date>>;

  constructor(
    private dadosService: DadosService,
  ) {
  }

  ngOnInit() {
    this.getPeriodosFeriasAbonos();
    this.getPeriodosDados();
  }

  getPeriodosDados(): void {
    this.dadosService.getPeriodosDados().subscribe(
      response => {
        console.log(response);
        this.paidLeave = response[0];
      },
      error => {
        console.log(error);
      }
    );
  }

  getPeriodosFeriasAbonos(): void {
    this.loading.periodos = true;
    this.dadosService.getPeriodosFeriasAbonos().pipe(
      mergeMap((i: Array<any>) => i),
      map((item: Array<string>) => item.map(i => parseISO(i))),
      toArray()
    ).subscribe(
      response => {
        console.log(response);
        this.periodos = response;
        this.loading.periodos = false;
      },
      error => {
        console.log(error);
        this.loading.periodos = false;
      }
    );
  }

  getMonth(date: string): Date {
    return parseISO(date);
  }
}
