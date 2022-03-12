import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {parseISO} from 'date-fns';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-ausencias-horas-extras',
  templateUrl: './ausencias-horas-extras.page.html',
  styleUrls: ['./ausencias-horas-extras.page.scss'],
})
export class AusenciasHorasExtrasPage implements OnInit {

  pagination = {
    atual: 1,
    rows: 10,
    total: 0,
    next: false,
  };

  ausencias: any = [];

  constructor(
    private dadosService: DadosService,
  ) {
  }

  ngOnInit() {
    this.getLista(this.pagination.atual, this.pagination.rows).catch();
  }

  async getLista(pag: number, rows: number) {
    const response = await this.dadosService.getAusenciasHorasExtras(pag, rows).pipe(delay(1500)).toPromise();
    console.log(response);
    for (const result of response.results) {
      this.ausencias.push(result);
    }
    this.pagination.total = response.count;
    this.pagination.next = response.next !== null;
    return Promise.resolve();
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }

  loadData(event) {
    if (this.pagination.next) {
      this.getLista(this.pagination.atual + 1, this.pagination.rows).then(() => {
        event.target.complete();
      }).catch(() => {
        event.target.cancel();
      });
    } else {
      event.target.disabled = true;
    }
  }
}
