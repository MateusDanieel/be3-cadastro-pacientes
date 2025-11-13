import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

//
import { Api, Paciente } from './services/api';

@Component({
  selector: 'app-root',
  //
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

//
export class App {
  //
  pacientes: Paciente[] = [];
  carregando = true;
  erro = '';

  //
  constructor(private api: Api) {}

  //
  ngOnInit() {
    this.api.getPacientes().subscribe({
      next: (dados) => {
        this.pacientes = dados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pacientes:', err);
        this.erro = 'Não foi possível carregar os pacientes.';
        this.carregando = false;
      },
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
