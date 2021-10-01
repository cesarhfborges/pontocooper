import {Component, OnInit} from '@angular/core';
import {DadosService} from '../core/services/dados.service';
import {Ponto} from '../core/models/ponto';
import {format, getHours, parseISO, set} from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  ponto: Ponto;

  horasTrabalhadas: Date = set(new Date(), {hours: 0, minutes: 0, seconds: 0});

  coords = {
    lat: -15.8949162,
    lon: -48.1160966
  };

  summary: {
    workingHours: number;
    businessDays: number;
    hoursToWork: number;
    remainingHours: number;
  } = {
    workingHours: 0,
    businessDays: 0,
    hoursToWork: 0,
    remainingHours: 0,
  };

  constructor(
    private dadosService: DadosService,
  ) {
    const batidas: Array<Date> = [];
    this.ponto = new Ponto(batidas);
    setInterval(() => {
      this.horasTrabalhadas = this.ponto.horasTrabalhadas;

      const start = set(new Date(), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
    }, 1000);
  }

  get jornadaDiaria(): number {
    const val = Math.trunc(getHours(this.horasTrabalhadas) / 8 * 100);
    return val > 99 ? 100 : val;
  }

  ngOnInit(): void {
    const dateNow: Date = new Date(Date.now());
    this.dadosService.getSummary(format(dateNow, 'yyyy'), format(dateNow, 'MM')).subscribe(
      response => {
        this.summary = {
          workingHours: response.working_hours,
          businessDays: response.business_days,
          hoursToWork: response.hours_to_work,
          remainingHours: response.remaining_hours
        };
      },
      error => {
        console.log(error);
      }
    );

    this.dadosService.getTimeline().subscribe(
      response => {
        for (const batida of response.timeline) {
          this.ponto.addPonto(parseISO(batida.worktime_clock));
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  registrarPonto(): void {
    this.dadosService.baterPonto({check_in: !this.ponto.trabalhando, latitude: this.coords.lat, longitude: this.coords.lon}).subscribe(
      response => {
        this.ponto.baterPonto();
        if (this.ponto.isInterval()) {
          // this.alerts.push({data: addHours(new Date(), 1), message: 'Não esqueça de bater o ponto de retorno.'});
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
