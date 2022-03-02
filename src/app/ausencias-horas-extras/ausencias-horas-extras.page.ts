import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {parseISO} from 'date-fns';

@Component({
  selector: 'app-ausencias-horas-extras',
  templateUrl: './ausencias-horas-extras.page.html',
  styleUrls: ['./ausencias-horas-extras.page.scss'],
})
export class AusenciasHorasExtrasPage implements OnInit {

  tableOptions = {
    pagina: 1,
    rows: 10,
    columnMode: ColumnMode,
  };

  ausencias: any;

  constructor(
    private dadosService: DadosService,
  ) {
  }

  ngOnInit() {
    this.getLista();
  }

  getLista() {
    this.dadosService.getAusenciasHorasExtras(this.tableOptions.pagina, this.tableOptions.rows).subscribe(
      response => {
        console.log(response);
        this.ausencias = response.results;
      }
    );
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }
}
