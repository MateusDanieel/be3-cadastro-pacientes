import { Injectable } from '@angular/core';

//
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class Api {
  //
  private baseUrl = 'http://localhost:5155/api/pacientes';

  //
  constructor(private http: HttpClient) {}

  /**/ 
  getPacientes() {
    return this.http.get(this.baseUrl);
  }

  getPacienteById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addPaciente(paciente: any) {
    return this.http.post(this.baseUrl, paciente);
  }

  updatePaciente(id: number, paciente: any) {
    return this.http.put(`${this.baseUrl}/${id}`, paciente);
  }

  deletePaciente(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /**/ 
}
