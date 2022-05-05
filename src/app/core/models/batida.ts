export interface Batida {
  check_in: boolean;
  check_in_display: string;
  id: number;
  latitude: number;
  longitude: number;
  minimum_break: boolean;
  position: number;
  rectification?: {
    status: string;
    status_display: string;
  };
  worktime_clock: Date;
}
