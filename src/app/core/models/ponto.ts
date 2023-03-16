import {addMinutes, addSeconds, differenceInMinutes, differenceInSeconds, formatISO, parseISO, set} from 'date-fns';
import {Observable, of} from 'rxjs';
import {Batida} from './batida';

export class Ponto {

  static intervalos: Array<{
    label: string;
    value: number;
  }> = [
    {value: 30, label: '00:30'},
    {value: 45, label: '00:45'},
    {value: 60, label: '01:00'},
    {value: 90, label: '01:30'},
    {value: 120, label: '02:00'},
  ];
  private listaBatidas: Array<Batida>;

  constructor(batidas: Array<Batida>) {
    this.listaBatidas = batidas;
  }

  get batidas(): Array<Batida> {
    return this.listaBatidas;
  }

  get trabalhando(): boolean {
    return this.listaBatidas?.length > 0 && this.listaBatidas.length % 2 === 1;
  }

  get horasTrabalhadas(): Date {
    const start = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    if (this.listaBatidas && this.listaBatidas.length > 0) {
      const diff: Array<number> = this.listaBatidas.map(e => e.worktime_clock.getTime() / 1000);
      if (diff.length % 2 === 1) {
        diff.push(new Date().getTime() / 1000);
      }
      const res: number = diff.reduce((a, b) => b - a);
      return addSeconds(start, res);
    }
    return start;
  }

  static intervalo(val: number): { label: string; value: number } {
    if (val) {
      return Ponto.intervalos.find(i => i.value === val);
    }
    return {value: 30, label: '00:30'};
  }

  public baterPonto(pausa: boolean = false): void {
    this.listaBatidas.push({
      worktime_clock: new Date(),
      id: null,
      check_in: true,
      check_in_display: 'teste',
      longitude: null,
      latitude: null,
      minimum_break: pausa,
      position: 99
    });
  }

  setIntervalo(intervalo: boolean = false, tempo: number = 0): void {
    if (intervalo) {
      localStorage.setItem('intervalo', formatISO(addMinutes(new Date(), tempo)));
    } else {
      localStorage.removeItem('intervalo');
    }
  }

  getIntervalo(): Observable<Date> {
    const dataHora: Date = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const ls = localStorage.getItem('intervalo');
    if (ls !== null && ls !== undefined) {
      const intervalo: Date = parseISO(ls);
      const diff: number = differenceInSeconds(intervalo, new Date());
      return of(addSeconds(dataHora, diff));
    }
    return of(undefined);
  }

  public addPonto(batida: Batida): void {
    this.listaBatidas.unshift(batida);
  }

  public limparPontos(): void {
    this.listaBatidas = [];
  }

  public isInterval(): boolean {
    if (
      this.listaBatidas !== null &&
      this.listaBatidas !== undefined &&
      this.listaBatidas.length > 1 &&
      this.listaBatidas.length % 2 === 0
    ) {
      const ultimaBatida: Batida = this.listaBatidas[this.listaBatidas.length - 1];
      if (ultimaBatida?.minimum_break === true) {
        return differenceInMinutes(new Date(), ultimaBatida.worktime_clock) < 1;
      }
    }
    return false;
  }

  getTempoPonto(): string {
    if (this.isInterval) {
      const ultimaBatida: Date = this.listaBatidas[this.listaBatidas.length - 1].worktime_clock;
      const dateEntered = addMinutes(ultimaBatida, 30);
      const now = new Date();
      const difference = dateEntered.getTime() - now.getTime();
      if (difference <= 0) {
        return '00:00:00';
      }
      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      hours %= 24;
      minutes %= 60;
      seconds %= 60;
      return ` ${this.format(hours)}:${this.format(minutes)}:${this.format(seconds)}`;
    }
    return '';
  }

  private format(val: number): string {
    return val.toString().padStart(2, '0');
  }
}
