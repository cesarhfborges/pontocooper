import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Configuracao {

  private darkMode$: boolean;
  private access$: string;
  private refresh$: string;
  private expire$: Date;

  constructor(options?: {
    darkMode?: boolean;
    access?: string;
    refresh?: string;
    expire?: Date;
  }) {
    this.darkMode$ = options?.darkMode ?? false;
    this.access$ = options?.access ?? null;
    this.refresh$ = options?.refresh ?? null;
    this.expire$ = options?.expire ?? null;
  }

  get darkMode(): boolean {
    return this.darkMode$;
  }

  set darkMode(mode: boolean) {
    this.darkMode$ = mode;
  }
}
