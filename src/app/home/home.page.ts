import {Component, OnInit} from '@angular/core';
import {SessionStorageService} from '../core/services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private session: SessionStorageService
  ) {
  }

  ngOnInit(): void {
  }

  teste() {
    console.warn('Click');
  }
}
