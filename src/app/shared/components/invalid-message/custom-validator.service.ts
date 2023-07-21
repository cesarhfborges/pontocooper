import {Injectable} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { isAfter, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {

  constructor() {
  }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    const config: any = {
      required: 'Campo Obrigatório.',
      min: `O Valor mínimo é R$ ${validatorValue?.min ? CustomValidatorService.formatNumber(validatorValue?.min) : '0,00'}.`,
      max: `O Valor máximo é R$ ${validatorValue?.max ? CustomValidatorService.formatNumber(validatorValue?.max) : '0,00'}.`,
      invalidNumberField: 'Somente números são aceitos.',
      email: 'Endereço de email invalido.',
      minlength: `Tamanho mínimo ${validatorValue?.requiredLength} caracteres.`,
      timeGreaterThanPrevious: 'Um ou mais itens está inválido, as horas informadas precisam ser subsequentes.'
    };
    return config[validatorName];
  }

  static beneficioRequired(control: AbstractControl): any {
    const beneficios: Array<any> = control.value;
    if (beneficios.length > 0) {
      const sel: Array<1 | 0> = beneficios.map(b => b.indicadorBeneficioSelecionado ? 1 : 0);
      if (!sel.includes(1)) {
        return {nenhumBeneficio: true};
      }
    }
    return null;
  }

  static validateHours(formArray: AbstractControl): { [key: string]: boolean } | null {
    const values = formArray.value;
    for (let i = 1; i < values.length; i++) {
      const actualDate = parseISO(values[i].worktimeClock);
      const nextDate = parseISO(values[i - 1].worktimeClock);
      if (isAfter(nextDate, actualDate)) {
        return { timeGreaterThanPrevious: true };
      }
    }
    return null;
  }

  static findInvalidControls(f: FormGroup) {
    const invalid = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  private static formatNumber(n: number): string {
    return n.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }
}
