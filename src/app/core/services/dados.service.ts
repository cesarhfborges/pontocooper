import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {format} from 'date-fns';

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

  getPeriodosFeriasAbonos(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/paid_leave/reference_periods`);
  }

  getPeriodos(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/paid_leave/`);
  }

  getPeriodosDados(periodo: string): Observable<any> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/paid_leave/?start_period=${periodo}`);
  }

  getProducao(year: number, month: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/my_production_history/?year=${year.toString()}&month=${month.toString()}`);
  }

  solicitarRetificacao(dados: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rectification_request/`, dados);
  }

  solicitarHoraExtra(dia: string, dados: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/request/past/${dia}/`, dados);
  }

  solicitarAusencia(dados: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/request/`, dados);
  }

  getAusenciasHorasExtras(page: number = 1, size: number = 10): Observable<any> {
    return this.http.get(`${environment.apiUrl}/request/?page=${page}&page_size=${size}`);
  }

  calcularUltimoDia(data: Date, quantidade: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/paid_leave/calculate_last_date/${format(data, 'yyyy-MM-dd')}/${quantidade}`);
  }
}
