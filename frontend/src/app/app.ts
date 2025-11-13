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
}
