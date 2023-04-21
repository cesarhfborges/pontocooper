import {Component, Input, OnInit} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {Ponto} from '../../../core/models/ponto';
import {Batida} from '../../../core/models/batida';

@Component({
  selector: 'app-entradas-saidas',
  templateUrl: './entradas-saidas.component.html',
  styleUrls: ['./entradas-saidas.component.scss'],
  animations: [
    trigger('slideOutAnimation', [
      transition('* => *', [
        query(':leave',
          style({opacity: 1}),
          {optional: true}
        ),
        query(':leave', [
            style({opacity: 1}),
            animate('600ms ease-in-out', style({opacity: 0}))],
          {optional: true}
        ),
        query(':enter',
          style({opacity: 0, transform: 'translateX(-30px)'}),
          {optional: true}
        ),
        query(':enter', stagger(150, [
          style({opacity: 0, transform: 'translateX(-30px)'}),
          animate('250ms ease-in-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true}),
      ])
    ]),
  ]
})
export class EntradasSaidasComponent  implements OnInit {

  @Input() loading: boolean;
  @Input() ponto: Ponto;
  @Input() mostrarSegundos = false;

  constructor() {
    this.loading = false;
    const batidas: Array<Batida> = [];
    this.ponto = new Ponto(batidas);
  }

  ngOnInit() {}

}
