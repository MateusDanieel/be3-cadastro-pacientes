import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

//
import { Api, Paciente } from './services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  //standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

//
export class App {
  //
  pacientes: Paciente[] = [];
  convenios: any[] = [];
  carregando = true;
  erro = '';

  //
  novoPaciente: any = {
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    genero: '',
    cpf: '',
    rg: '',
    ufRg: '',
    email: '',
    celular: '',
    telefone: '',
    convenioId: null,
    numeroCarteirinha: '',
    validadeCarteirinha: ''
  };

  //
  constructor(private api: Api) {}

  //
  criarPaciente() {
    const novoPaciente = {
      //id: 102, // Trocar ID
      nome: "Marcos",
      sobrenome: "Roberto da Silva",
      dataNascimento: "1989-02-10",
      genero: "Masculino",
      cpf: "35312678740", // Banco validando cpf duplicado
      rg: "1022212368",
      ufRg: "SP",
      email: "l@l",
      celular: "11989051832",
      telefone: "1122544956",
      /*
      convenio: null,
      convenioId: null,
      validadeCarteirinha: undefined
      */
    };

    this.api.addPaciente(novoPaciente).subscribe({
      next: (res: any) => {
        console.log('Paciente criado com sucesso:', res);
        this.carregarPacientes();
      },
      error: (err: any) => console.error('Erro ao criar paciente:', err)
    });
  }

  //
  carregarPacientes() {
    this.carregando = true;
    this.api.getPacientes().subscribe({
      next: (dados: Paciente[]) => {
        this.pacientes = dados;
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar pacientes:', err);
        this.erro = 'Não foi possível carregar os pacientes.';
        this.carregando = false;
      }
    });
  }

  carregarConvenios() {
    this.api.getConvenios().subscribe({
      next: (dados) => this.convenios = dados,
      error: () => console.error('Erro ao carregar os convênios.')
    });
  }

  //
  inativarPaciente(id: number) {
    if (!confirm('Deseja inativar este paciente?')) return;

    this.api.deletePaciente(id).subscribe({
      next: () => {
        console.log('Paciente inativado');
        this.carregarPacientes(); 
      },
      error: (err: any) => {
        console.error('Erro ao inativar paciente:', err);
        alert('Erro ao inativar paciente');
      }
    });
  }

  // MEXER AQUI !
  editarPaciente(p: Paciente) {
    
    const novoNome = prompt('Editar nome', p.nome);
    if (novoNome === null) return;
    const payload = { ...p, nome: novoNome };
    this.api.updatePaciente(p.id!, payload).subscribe({
      next: () => {
        console.log('Paciente atualizado');
        this.carregarPacientes();
      },
      error: (err: any) => {
        console.error('Erro ao atualizar paciente:', err);
        alert('Erro ao atualizar paciente');
      }
    });
  }

  //
  ngOnInit() {
    this.carregarConvenios();
    this.carregarPacientes();
  }

  //
  onSubmit() {
    const payload = {
      ...this.novoPaciente,
      convenioId: Number(this.novoPaciente.convenioId)
    };

    this.api.addPaciente(payload).subscribe({
      next: (res) => {
        console.log('✅ Paciente criado com sucesso:', res);
        this.pacientes.push(res);
        this.novoPaciente = { 
          nome: '',
          sobrenome: '',
          dataNascimento: '',
          genero: '',
          cpf: '',
          rg: '',
          ufRg: '',
          email: '',
          celular: '',
          telefone: '',
          convenioId: null,
          numeroCarteirinha: '',
          validadeCarteirinha: ''
        };
      },
      error: (err) => console.error('❌ Erro ao criar paciente:', err)
    });
  }
}
