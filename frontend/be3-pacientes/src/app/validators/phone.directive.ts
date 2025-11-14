import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[telefoneObrigatorio]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TelefoneObrigatorioDirective),
      multi: true
    }
  ]
})
export class TelefoneObrigatorioDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control) return null;

    const celular = control.get('celular')?.value;
    const telefone = control.get('telefone')?.value;

    const cel = celular ? celular.replace(/\D/g, '') : '';
    const tel = telefone ? telefone.replace(/\D/g, '') : '';

    if (cel.length > 0 || tel.length > 0) {
      return null;
    }

    return { telefoneObrigatorio: true };
  }
}
