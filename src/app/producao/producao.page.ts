import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {AlertController, Platform} from '@ionic/angular';
import {AuthService} from '../core/services/auth.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {parseISO, getDay, getMonth, getYear} from 'date-fns';

interface Dia {
  balance: string;
  date: string;
  day_type: any;
  paid_leave: any;
  production: string;
  timeline: Array<{
    id: number;
    check_in: boolean;
    check_in_display: string;
    latitude: string;
    longitude: string;
    minimum_break: boolean;
    position: number;
    rectification: {
      status: string;
      status_display: string;
    };
    worktime_clock: Date;
  }>;
}

@Component({
  selector: 'app-producao',
  templateUrl: './producao.page.html',
  styleUrls: ['./producao.page.scss'],
})
export class ProducaoPage implements OnInit {

  producao: Array<Dia>;

  dataAtual: Date = new Date();

  constructor(
    private dadosService: DadosService,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private statusBar: StatusBar,
  ) {
  }

  ngOnInit() {
    this.getProducao();
  }

  getProducao(): void {
    const ano: number = getYear(this.dataAtual);
    const mes: number = getMonth(this.dataAtual);
    console.log(ano, mes);
    this.dadosService.getProducao(ano, mes + 1).subscribe(
      response => {
        console.log(response);
        this.producao = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  formatDate(data: string): Date {
    return parseISO(data);
  }

  isNow(data: string): boolean {
    const dt: Date = parseISO(data);
    return this.dataAtual.getDay() === dt.getDay() &&
      this.dataAtual.getMonth() === dt.getMonth() &&
      this.dataAtual.getFullYear() === dt.getFullYear();
  }
}
