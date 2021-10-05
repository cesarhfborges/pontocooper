export interface Dia {
  balance: string;
  date: string;
  day_type: any;
  paid_leave: any;
  production: string;
  timeline: Array<Timeline>;
}

export interface Timeline {
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
}
