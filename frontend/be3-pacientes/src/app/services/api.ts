import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

export interface Paciente {
  id: number,
  nome: string,
  sobrenome: string,
  ativo: boolean,
  dataNascimento: string,
  genero: string,
  cpf: string,
  rg: string,
  ufRg: string,
  email: string,
  celular: string,
  telefone: string,
  convenio?: { id: number; nome: string } | null,
  convenioId?: number | null,
  numeroCarteirinha: string,
  validadeCarteirinha: string
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  
  private baseUrl = 'http://localhost:5155/api';

  constructor(private http: HttpClient) {}

  getConvenios() {
    return this.http.get<any[]>(`${this.baseUrl}/convenios`);
  }

  getPacientes(incluirInativos: boolean = false): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/pacientes?incluirInativos=${incluirInativos}`);
  }

  addPaciente(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}/pacientes`, paciente);
  }

  getPacienteById(id: number) {
    return this.http.get(`${this.baseUrl}/pacientes/${id}`);
  }

  updatePaciente(id: number, paciente: any): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.baseUrl}/pacientes/${id}`, paciente);
  }

  deletePaciente(id: number) {
    return this.http.patch(`${this.baseUrl}/pacientes/${id}/inativar`, {});
  }

  verificarCpfExistente(cpf: string) {
    return this.http.get<boolean>(`${this.baseUrl}/pacientes/verificar-cpf/${cpf}`);
  }

}
