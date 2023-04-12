import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
// import {Configuracao} from '../models/configuracao';

export class State implements OnDestroy {

  // private configuracao = new BehaviorSubject<Configuracao>(new Configuracao());
  // private conf = this.configuracao.asObservable();

  constructor() {
  }

  ngOnDestroy(): void {
    // this.configuracao.unsubscribe();
  }
}
