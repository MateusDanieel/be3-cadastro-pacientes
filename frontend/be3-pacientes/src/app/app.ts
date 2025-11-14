import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api, Paciente } from './services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  pacientes: Paciente[] = [];
  convenios: any[] = [];
  carregando = true;
  erro = '';
  editando: boolean = false;
  pacienteEditandoId: number | null = null;

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

  constructor(private api: Api) {}

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

  editarPaciente(p: Paciente) {
    this.editando = true;
    this.pacienteEditandoId = p.id;
    this.novoPaciente = { ...p, convenioId: p.convenio?.id || null };
  }

  getConvenioNome(id: number | null | undefined): string {
    if (!id) return '';
    const conv = this.convenios.find(c => c.id === id);
    return conv ? conv.nome : '';
  }

  ngOnInit() {
    this.carregarConvenios();
    this.carregarPacientes();
  }

  onSubmit() {
    if (this.editando && this.pacienteEditandoId !== null) {
      this.api.updatePaciente(this.pacienteEditandoId, this.novoPaciente).subscribe({
        next: (res) => {
          console.log('Paciente atualizado com sucesso:', res);
          const index = this.pacientes.findIndex(p => p.id === this.pacienteEditandoId);
          if (index > -1) this.pacientes[index] = res;
          this.resetForm();
          this.carregarPacientes();
        },
        error: (err) => console.error('Erro ao atualizar paciente:', err)
      });
    } else {
      this.api.addPaciente(this.novoPaciente).subscribe({
        next: (res) => {
          console.log('Paciente criado com sucesso:', res);
          this.pacientes.push(res);
          this.resetForm();
        },
        error: (err) => console.error('Erro ao criar paciente:', err)
      });
    }
  }

  resetForm() {
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
    this.editando = false;
    this.pacienteEditandoId = null;
  }
}
