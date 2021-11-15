import {addMinutes, addSeconds, differenceInMinutes, set} from 'date-fns';

export class Ponto {

  private listaBatidas: Array<Date>;

  constructor(batidas: Array<Date>) {
    this.listaBatidas = batidas;
  }

  get batidas(): Array<Date> {
    return this.listaBatidas;
  }

  get trabalhando(): boolean {
    return this.listaBatidas && this.listaBatidas.length > 0 && this.listaBatidas.length % 2 === 1;
  }

  get horasTrabalhadas(): Date {
    const start = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    if (this.listaBatidas && this.listaBatidas.length > 0) {
      const diff: Array<number> = this.listaBatidas.map(e => e.getTime() / 1000);
      if (diff.length % 2 === 1) {
        diff.push(new Date().getTime() / 1000);
      }
      const res: number = diff.reduce((a, b) => b - a);
      return addSeconds(start, res);
    }
    return start;
  }

  public baterPonto(): void {
    this.listaBatidas.push(new Date());
  }

  public addPonto(data: Date): void {
    this.listaBatidas.unshift(data);
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
      const ultimaBatida: Date = this.listaBatidas[this.listaBatidas.length - 1];
      if (ultimaBatida) {
        return differenceInMinutes(new Date(), ultimaBatida) < 2;
      }
    }
    return false;
  }

  getTempoPonto(): string {
    if (this.isInterval) {
      const ultimaBatida: Date = this.listaBatidas[this.listaBatidas.length - 1];
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
