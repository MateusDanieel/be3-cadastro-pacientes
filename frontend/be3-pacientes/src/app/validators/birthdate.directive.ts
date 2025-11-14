import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appDataFutura]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DataFuturaValidatorDirective,
      multi: true
    }
  ]
})
export class DataFuturaValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    const hoje = new Date();
    const dataInput = new Date(valor);

    return dataInput > hoje ? { dataFutura: true } : null;
  }
}
