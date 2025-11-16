import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api, Paciente } from './services/api';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe  } from 'ngx-mask';
import { CpfValidatorDirective, CpfDuplicateDirective } from './validators/cpf.directive';
import { DataFuturaValidatorDirective } from './validators/birthdate.directive';
import { EmailValidatorDirective } from './validators/email.directive';
import { TelefoneObrigatorioDirective } from './validators/phone.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, NgxMaskDirective, NgxMaskPipe , CpfValidatorDirective, CpfDuplicateDirective, DataFuturaValidatorDirective, EmailValidatorDirective, TelefoneObrigatorioDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  mostrarInativos = false;
  pacientes: Paciente[] = [];
  convenios: any[] = [];
  carregando = true;
  erro = '';
  editando: boolean = false;
  pacienteEditandoId: number | null = null;
  cpfOriginal: string | null = null;

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

    this.api.getPacientes(this.mostrarInativos).subscribe({
      next: (dados: Paciente[]) => {
        this.pacientes = dados;
        this.carregando = false;
      },
      error: (err: any) => {
        this.alerta('Erro ao carregar pacientes: ' + err, 'error');
        this.erro = 'Não foi possível carregar os pacientes.';
        this.carregando = false;
      }
    });
  }

  carregarConvenios() {
    this.api.getConvenios().subscribe({
      next: (dados) => this.convenios = dados,
      error: () => this.alerta('Erro ao carregar os convênios.', 'error')

    });
  }

  inativarPaciente(id: number) {
    if (!confirm('Deseja inativar este paciente?')) return;

    this.api.deletePaciente(id).subscribe({
      next: () => {
        this.alerta('Paciente inativado com sucesso.', 'success');
        this.carregarPacientes(); 
      },
      error: (err: any) => {
        this.alerta('Erro ao inativar paciente:' + err, 'error')
      }
    });
  }

  editarPaciente(p: Paciente) {
    this.editando = true;
    this.pacienteEditandoId = p.id;
    this.novoPaciente = { ...p, convenioId: p.convenio?.id || null };

    this.cpfOriginal = p.cpf;
    
    if (this.novoPaciente.dataNascimento) {
      this.novoPaciente.dataNascimento =
        this.novoPaciente.dataNascimento.split("T")[0];
    }

    if (this.novoPaciente.validadeCarteirinha) {
      this.novoPaciente.validadeCarteirinha =
        this.novoPaciente.validadeCarteirinha.split("T")[0];
    }

    this.abrirModal('#modalForm');
  }

  getConvenioNome(id: number | null | undefined): string {
    if (!id) return '';
    const conv = this.convenios.find(c => c.id === id);
    return conv ? conv.nome : '';
  }

  abrirModal(el: any) {
    document.querySelector(el).removeAttribute('hidden');
    
    const scrollPos = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPos}px`;
    document.body.style.width = '100%';
  }

  fecharModal(el: any) {
    document.querySelector(el).setAttribute('hidden', '');

    const scrollPos = Math.abs(parseInt(document.body.style.top, 10));
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPos);

    this.resetForm();
  }

  onBackdropClick(event: MouseEvent, el: any) {
    const backdrop = event.currentTarget;
    const clicked = event.target;

    if (backdrop === clicked) {
      this.fecharModal(el);
    }
  }

  alerta(msg: string, cat: 'success' | 'error') {
    const div = document.createElement('div');

    div.className = `component__alert component__alert--${cat}`;
    div.setAttribute('role', 'alert');
    div.innerText = msg;

    document.querySelector('body')?.appendChild(div);

    setTimeout(() => div.remove(), 3000);
  }

  resetForm() {
    this.cpfOriginal = null;
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

  toggleMostrarInativos() {
    this.mostrarInativos = !this.mostrarInativos;
    this.carregarPacientes();
  }

  onSubmit() {
    if (this.editando && this.pacienteEditandoId !== null) {
      this.api.updatePaciente(this.pacienteEditandoId, this.novoPaciente).subscribe({
        next: (res) => {
          this.alerta('Paciente atualizado com sucesso.', 'success');
          const index = this.pacientes.findIndex(p => p.id === this.pacienteEditandoId);
          if (index > -1) this.pacientes[index] = res;
          this.fecharModal('#modalForm');
          this.carregarPacientes();
          
        },
        error: (err) => this.alerta('Erro ao atualizar paciente:' + err, 'error')
      });
    } else {
      this.api.addPaciente(this.novoPaciente).subscribe({
        next: (res) => {
          this.alerta('Paciente cadastrado com sucesso:', 'success');
          this.pacientes.push(res);
          this.fecharModal('#modalForm');
        },
        error: (err) => this.alerta('Erro ao cadastrar paciente:' + err, 'error')
      });
    }
  }

  ngOnInit() {
    this.carregarConvenios();
    this.carregarPacientes();
  }

}
