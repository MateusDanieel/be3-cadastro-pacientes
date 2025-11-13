import { Injectable } from '@angular/core';

//
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//
export interface Paciente {
  id: number,
  nome: string,
  sobrenome: string,
  dataNascimento: string,
  genero: string,
  cpf: string,
  rg: string,
  ufRg: string,
  email: string,
  celular: string,
  telefone: string,
  convenio: string,
  convenioId: string,
  validadeCarteirinha: string
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  //
  private baseUrl = 'http://localhost:5155/api';

  //
  constructor(private http: HttpClient) {}

  /**/ 
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/pacientes`);
  }

  addPaciente(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}/pacientes`, paciente);
  }

  getPacienteById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  

  updatePaciente(id: number, paciente: any) {
    return this.http.put(`${this.baseUrl}/${id}`, paciente);
  }

  deletePaciente(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /**/ 
}
