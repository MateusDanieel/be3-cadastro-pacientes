import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Api } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');

  //
  constructor(private api: Api) {}

  //
  ngOnInit() {
    this.api.getPacientes().subscribe({
      next: (data: any) => console.log('Pacientes:', data),
      error: (err: any) => console.error('Erro ao buscar pacientes:', err)
    });
  }

  //
  criarPaciente() {
    const novoPaciente = {
      nome: 'Daniel da Silva',
      idade: 28,
      cpf: '12345678900',
      celular: '(11) 99999-9999'
    };

    this.api.addPaciente(novoPaciente).subscribe({
      next: (res: any) => console.log('Paciente criado com sucesso:', res),
      error: (err: any) => console.error('Erro ao criar paciente:', err)
    });
  }
}
