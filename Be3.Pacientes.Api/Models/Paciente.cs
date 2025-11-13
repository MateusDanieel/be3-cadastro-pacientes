using System;

namespace Be3.Pacientes.Api.Models
{
    public class Paciente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Sobrenome { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string Genero { get; set; } = string.Empty;
        public string? CPF { get; set; }
        public string RG { get; set; } = string.Empty;
        public string UfRg { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Celular { get; set; }
        public string? Telefone { get; set; }
        public int? ConvenioId { get; set; }
        public string? NumeroCarteirinha { get; set; }
        public string? ValidadeCarteirinha { get; set; }
        public bool Ativo { get; set; } = true;

        public Convenio? Convenio { get; set; }
    }
}
