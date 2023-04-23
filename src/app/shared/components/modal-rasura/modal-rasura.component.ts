import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {ModalController, ViewDidEnter} from '@ionic/angular';
import {Dia} from '../../../core/models/dia';
import {Observable, of} from 'rxjs';
import {addSeconds, differenceInSeconds, parseISO, set} from 'date-fns';

@Component({
  selector: 'app-modal-rasura',
  templateUrl: './modal-rasura.component.html',
  styleUrls: ['./modal-rasura.component.scss'],
  animations: [
    trigger('slideOutAnimation', [
      transition('* => *', [
        query(':enter',
          style({opacity: 0, transform: 'translateX(30px)'}),
          {optional: true}
        ),
        query(':enter', stagger(150, [
          style({opacity: 0, transform: 'translateX(30px)'}),
          animate('250ms ease-in-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true}),
        query(':leave',
          style({opacity: 1}),
          {optional: true}
        ),
        query(':leave', [
            style({opacity: 1}),
            animate('250ms ease-in-out', style({opacity: 0, transform: 'translateX(30px)'}))],
          {optional: true}
        )
      ])
    ])
  ]
})
export class ModalRasuraComponent implements OnInit, OnDestroy, ViewDidEnter {

  @Input() dados: Dia | undefined;

  form: FormGroup;
  agora: Date = new Date();


  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
  ) {
    this.form = this.fb.group({
      date: ['', [Validators.required]],
      reason: [''],
      rectifications: this.fb.array([]),
    });
  }

  get retificacoes(): FormArray {
    if (this.form.get('rectifications') !== null) {
      return this.form.get('rectifications') as FormArray;
    }
    return this.fb.array([]);
  }

  ionViewDidEnter(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    if (this.dados) {
      this.form.get('date')?.patchValue(this.dados.date);
      for (const dia of this.dados.timeline) {
        const f: FormGroup = this.createRetificacao();
        f.patchValue({
          checkIn: dia.check_in,
          position: dia.position.toString(),
          worktimeClock: dia.worktime_clock
        });
        // f.disable();
        this.retificacoes.push(f);
        this.form.updateValueAndValidity();
      }
    }
  }

  createRetificacao(): FormGroup {
    return this.fb.group({
      checkIn: this.fb.control(null, [Validators.required]),
      position: this.fb.control(null, [Validators.required]),
      worktimeClock: this.fb.control(null, [Validators.required]),
    });
  }

  addRetificacao(): void {
    const size: number = this.retificacoes.controls.length;
    if (size < 10) {
      const f: FormGroup = this.createRetificacao();
      const posicao: boolean = this.retificacoes.controls.length % 2 === 0;
      f.patchValue({
        checkIn: posicao,
        position: posicao ? ((size / 2) + 1).toFixed(0) : (size / 2).toFixed(0)
      });
      this.retificacoes.push(f);
      this.form.updateValueAndValidity();
    }
  }

  deleteRetificacao(posicao: number): void {
    this.retificacoes.removeAt(posicao);
    this.form.updateValueAndValidity();
  }

  async cancelar() {
    await this.modalCtrl.dismiss({
      success: false
    });
  }

  checkDeletePossible(index: number): boolean {
    return !!(this.dados && (index + 1) > this.dados.timeline.length);
  }

  diferenca(): Observable<Date> {
    if (this.dados?.date) {
      const baseDate: Date = set(parseISO(this.dados.date), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});
      const batidas: Array<Date> = this.retificacoes.controls
        .filter(r => r.get('worktimeClock')?.value !== null && r.get('worktimeClock')?.value !== '')
        .map(r => parseISO(r.get('worktimeClock')?.value));
      if (batidas.length > 0) {
        if (batidas.length % 2 === 1) {
          batidas.push(this.agora);
        }
        const batida: Date = batidas.reduce((a, b, i, x) => {
          const diff: number = differenceInSeconds(x[i], x[i - 1]);
          if (i === 0) {
            return a;
          } else if (i % 2 === 1) {
            return addSeconds(a, diff);
          } else {
            return a;
          }
        }, baseDate);
        return of(batida);
      }
    }
    return of(set(new Date(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0}));
  }

  salvar(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
    }
  }
}
