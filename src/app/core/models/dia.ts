export interface Dia {
  balance: {
    solicitation: Solicitation[];
    total_balance: string;
  };
  date: string;
  day_type?: {
    day_type: string;
    day_type_display: string;
    status: string;
    status_display: string;
  };
  paid_leave: any;
  production: string;
  timeline: Array<Timeline>;
}

export interface Solicitation {
  status: string;
  status_display: string;
  request_type: string;
  request_type_display: string;
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
