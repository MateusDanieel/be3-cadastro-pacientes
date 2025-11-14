import { Directive, Injectable, Input } from '@angular/core';
import { NG_VALIDATORS, NG_ASYNC_VALIDATORS, Validator, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, map, catchError } from 'rxjs';
import { Api } from '../services/api';

@Directive({
  selector: '[cpfValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CpfValidatorDirective,
      multi: true
    }
  ]
})
@Injectable()
export class CpfValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return { cpfInvalido: true };
    }

    // Validação dos dígitos
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf[9])) return { cpfInvalido: true };

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf[10])) return { cpfInvalido: true };

    return null;
  }
}

@Directive({
  selector: '[cpfDuplicate]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: CpfDuplicateDirective,
      multi: true
    }
  ]
})
@Injectable()
export class CpfDuplicateDirective implements AsyncValidator {

  @Input() pacienteId!: number | null; 
  @Input() cpfOriginal!: string | null;

  constructor(private api: Api) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    let cpf = control.value;
    if (!cpf) return of(null);
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length < 11) return of(null);

    const originalCpf = this.cpfOriginal?.replace(/\D/g, '');
    if (this.pacienteId && originalCpf === cpf) {
      return of(null);
    }

    return this.api.verificarCpfExistente(cpf).pipe(
      map((existe: boolean) => (existe ? { cpfJaExiste: true } : null)),
      catchError(() => of(null))
    );
  }
}
