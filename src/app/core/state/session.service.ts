import {Injectable} from '@angular/core';
import {Auth} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private storeKey: string = btoa('coopersystem');

  private auth: Auth | null = null;

  constructor() {
    console.log('Construtor SessionService');
    this.auth = this.load();
  }

  get credentials(): Auth | null {
    return this.auth;
  }

  set credentials(data: any) {
    const stringfied: string = JSON.stringify(data);
    const encript: string = btoa(stringfied);
    window.localStorage.setItem(this.storeKey, encript);
    this.auth = data;
  }

  public isLoggedIn(): boolean {
    return !!window.localStorage.getItem(this.storeKey);
  }

  public clear(): void {
    this.auth = null;
    window.localStorage.removeItem(this.storeKey);
  }

  private load(): Auth | null {
    const data: any = window.localStorage.getItem(this.storeKey);
    if (data !== null) {
      const decript: string = atob(data);
      return JSON.parse(decript);
    }
    return null;
  }
}
