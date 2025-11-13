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

  //
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
  getConvenioNome(id: number | null | undefined): string {
    if (!id) return '';
    const conv = this.convenios.find(c => c.id === id);
    return conv ? conv.nome : '';
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
