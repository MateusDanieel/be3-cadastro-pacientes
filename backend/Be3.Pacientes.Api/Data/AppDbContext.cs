using Microsoft.EntityFrameworkCore;
using Be3.Pacientes.Api.Models;

namespace Be3.Pacientes.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Convenio> Convenios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Paciente>()
                .HasIndex(p => p.CPF);

            modelBuilder.Entity<Convenio>().HasData(
                new Convenio { Id = 1, Nome = "Amil" },
                new Convenio { Id = 2, Nome = "Bradesco Saúde" },
                new Convenio { Id = 3, Nome = "Unimed" },
                new Convenio { Id = 4, Nome = "SulAmérica" },
                new Convenio { Id = 5, Nome = "NotreDame" }
            );
        }
    }
}
