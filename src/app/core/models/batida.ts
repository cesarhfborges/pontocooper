export interface Batida {
  id: number | null;
  check_in: boolean;
  check_in_display: string;
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
