import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {Preferences} from '@capacitor/preferences';
import {addMinutes, formatISO} from 'date-fns';

interface IAuth {
  access: string;
  expire: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keyName = 'suyJN1guijg/9avvjE1ctw==';

  private auth = new BehaviorSubject<IAuth | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.getStore().then(auth => {
      this.auth.next(auth);
    });
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('CapacitorStorage.' + this.keyName);
  }

  login(data: { email: string; password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth`, data).pipe(
      map(response => {
        if (response.access) {
          this.setAuth(response).catch();
          return true;
        }
        return false;
      })
    );
  }

  private async setAuth(data: any): Promise<IAuth> {
    try {
      const auth: IAuth = {
        ...data,
        expire: formatISO(addMinutes(new Date(), 5))
      };
      await this.setStore(auth);
      this.auth.next(auth);
      return auth;
    } catch (e) {
      throw new Error('Não foi possivel efetuar login');
    }
  }

  private async setStore(data: IAuth) {
    await Preferences.set({
      key: this.keyName,
      value: btoa(JSON.stringify(data)),
    });
    if (!environment.production) {
      localStorage.setItem('content_DEV', JSON.stringify(data));
    }
  }

  private async getStore(): Promise<IAuth | undefined> {
    const {value} = await Preferences.get({key: this.keyName});
    if (typeof value === 'string') {
      return JSON.parse(atob(value));
    }
    return undefined;
  }
}
