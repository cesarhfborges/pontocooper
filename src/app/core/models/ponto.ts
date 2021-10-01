import {addSeconds, set} from 'date-fns';

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

  public isInterval(): boolean {
    return this.listaBatidas.length === 2;
  }
}
