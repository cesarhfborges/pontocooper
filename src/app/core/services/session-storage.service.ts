import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {Auth} from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private user_key = 'suyJN1guijg/9avvjE1ctw==';
  private authentication: BehaviorSubject<Auth | undefined> = new BehaviorSubject<Auth | undefined>(undefined);

  constructor() {
    this.load().then(data => {
      this.authentication.next(data);
    }).catch(error => {
      this.authentication.next(undefined);
    });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authentication.asObservable().pipe(
      map(data => !!data)
    );
  }

  public clear(): void {
    this.authentication.next(undefined);
    window.localStorage.clear();
  }

  private async store(data: Auth) {
    try {
      const stringfied: string = JSON.stringify(data);
      const encripted: string = btoa(stringfied);
      await window.localStorage.setItem(this.user_key, encripted);
    } catch (e) {
      throw new Error('Não foi possível realizar o store das credenciais.');
    }
  }

  private async load(): Promise<any> {
    const storage: any = window.localStorage.getItem(this.user_key);
    if (!!storage) {
      return atob(storage);
    }
    throw new Error('Não foi possível recuperar as credenciais.');
  }
}
