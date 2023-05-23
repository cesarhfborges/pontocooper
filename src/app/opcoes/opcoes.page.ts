import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Opcoes } from '../shared/models';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit, ViewWillEnter {

  form: FormGroup;

  opcoes: Opcoes;

  constructor(
    private fb: FormBuilder,
  ) {
    this.opcoes = {
      darkMode: [
        {label: 'Automático', value: 'automatico'},
        {label: 'Escuro', value: 'escuro'},
        {label: 'Claro', value: 'claro'},
      ],
    };
    this.form = this.fb.group({
      darkMode: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
  }

}
