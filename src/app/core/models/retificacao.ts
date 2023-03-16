export interface Retificacao {
  date: string;
  reason: string;
  rectifications: Array<Ajuste>;
}

export interface Ajuste {
  check_in: boolean;
  position: number;
  worktime_clock: Date;
}
