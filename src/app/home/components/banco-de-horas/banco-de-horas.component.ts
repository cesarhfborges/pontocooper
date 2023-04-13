import {Component, Input, OnInit} from '@angular/core';
import {Summary} from '../../../core/interfaces/summary';
import {BancoDeHoras} from '../../../core/interfaces/banco-de-horas';

@Component({
  selector: 'app-banco-de-horas',
  templateUrl: './banco-de-horas.component.html',
  styleUrls: ['./banco-de-horas.component.scss'],
})
export class BancoDeHorasComponent implements OnInit {

  @Input() loading: {bancoDeHoras: boolean; summary: boolean} = {bancoDeHoras: false, summary: false};
  @Input() summary: Summary | undefined;
  @Input() bancoDeHoras: BancoDeHoras | undefined;

  constructor() {
  }

  ngOnInit() {
  }

}
