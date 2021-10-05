import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Dia} from '../../../core/models/dia';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-rasura',
  templateUrl: './modal-rasura.component.html',
  styleUrls: ['./modal-rasura.component.scss']
})
export class ModalRasuraComponent implements OnInit, AfterViewInit {

  @Input() dados: Dia;

  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      reason: ['', Validators.required],
      rectifications: this.fb.array([]),
    });
  }

  get retificacoes(): FormArray {
    return this.form.get('rectifications') as FormArray;
  }

  ngOnInit() {
    this.form.get('date').patchValue(this.dados.date);
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

  ngAfterViewInit(): void {
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

  cancelar(): void {
    this.modalController.dismiss({
      success: false
    });
  }

  salvar(): void {
    this.modalController.dismiss({
      success: true,
      data: {teste: true}
    });
  }
}
