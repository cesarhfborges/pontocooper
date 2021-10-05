import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getPerson(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/person/`);
  }

  getPersonCurrent(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/person/current`);
  }

  baterPonto(dados): Observable<any> {
    return this.http.post(`${environment.apiUrl}/daily_worktime_clock/`, dados);
  }

  getTimeline(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/daily_worktime_clock/`);
  }

  getBancoDeHoras(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/my_compensatory_time`);
  }

  getSummary(year, month): Observable<any> {
    return this.http.get(`${environment.apiUrl}/work_month_summary/${year}/${month}/`);
  }

  getProducao(year: number, month: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/my_production_history/?year=${year.toString()}&month=${month.toString()}`);
  }
}
