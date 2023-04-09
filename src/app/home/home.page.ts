import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionStorageService} from '../core/services/session-storage.service';
import {Observable, timer} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  dataAtual: Date = new Date();
  timer: Observable<number> | undefined;


  constructor(
    private session: SessionStorageService
  ) {
  }

  ngOnInit(): void {
    this.dataAtual = new Date();
    this.timer = timer(1000, 1000);
  }

  ngOnDestroy(): void {
    this.timer = undefined;
  }

  teste() {
    console.warn('Click');
  }
}
