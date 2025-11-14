import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[emailValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmailValidatorDirective),
      multi: true
    }
  ]
})
export class EmailValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const email = (control.value || '').trim();

    if (!email) return null; 

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      return { emailInvalido: true };
    }

    return null;
  }
}
