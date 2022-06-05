import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';

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
      minlength: `Tamanho minimo ${validatorValue?.requiredLength} caracteres.`,
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

  private static formatNumber(n: number): string {
    return n.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }
}
