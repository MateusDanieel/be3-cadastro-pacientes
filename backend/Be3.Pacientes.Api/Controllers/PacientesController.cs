using Microsoft.AspNetCore.Mvc;
using Be3.Pacientes.Api.Data;
using Be3.Pacientes.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Be3.Pacientes.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PacientesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool incluirInativos = false)
        {
            var query = _context.Pacientes.Include(p => p.Convenio).AsQueryable();
            if (!incluirInativos) query = query.Where(p => p.Ativo);
            var list = await query.ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _context.Pacientes.Include(x => x.Convenio).FirstOrDefaultAsync(x => x.Id == id);
            if (p == null) return NotFound();
            return Ok(p);
        }

        [HttpGet("verificar-cpf/{cpf}")]
        public async Task<ActionResult<bool>> VerificarCpf(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf))
                return Ok(false);

            var onlyNumbers = new string(cpf.Where(char.IsDigit).ToArray());

            var exists = await _context.Pacientes
                .AnyAsync(x => x.CPF == onlyNumbers);

            return Ok(exists);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Paciente paciente)
        {
            if (paciente.DataNascimento > DateTime.UtcNow.Date)
                return BadRequest(new { Error = "Data de nascimento não pode ser futura." });

            if (string.IsNullOrWhiteSpace(paciente.CPF) == false)
            {
                var cpfOnlyNumbers = new string(paciente.CPF.Where(char.IsDigit).ToArray());
                var exists = await _context.Pacientes.AnyAsync(x => x.CPF == cpfOnlyNumbers);
                if (exists) return BadRequest(new { Error = "CPF já cadastrado." });
                paciente.CPF = cpfOnlyNumbers;
            }

            if (string.IsNullOrWhiteSpace(paciente.Celular) && string.IsNullOrWhiteSpace(paciente.Telefone))
                return BadRequest(new { Error = "Informe pelo menos um telefone (celular ou fixo)." });

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = paciente.Id }, paciente);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Paciente paciente)
        {
            if (id != paciente.Id) return BadRequest();

            var existing = await _context.Pacientes.FindAsync(id);
            if (existing == null) return NotFound();

            if (paciente.DataNascimento > DateTime.UtcNow.Date)
                return BadRequest(new { Error = "Data de nascimento não pode ser futura." });

            if (string.IsNullOrWhiteSpace(paciente.Celular) && string.IsNullOrWhiteSpace(paciente.Telefone))
                return BadRequest(new { Error = "Informe pelo menos um telefone (celular ou fixo)." });

            if (!string.IsNullOrWhiteSpace(paciente.CPF))
            {
                var cpfOnly = new string(paciente.CPF.Where(char.IsDigit).ToArray());
                var cpfExists = await _context.Pacientes.AnyAsync(x => x.CPF == cpfOnly && x.Id != id);
                if (cpfExists) return BadRequest(new { Error = "CPF já cadastrado por outro paciente." });
                existing.CPF = cpfOnly;
            }
            else
            {
                existing.CPF = null;
            }

            existing.Nome = paciente.Nome;
            existing.Sobrenome = paciente.Sobrenome;
            existing.DataNascimento = paciente.DataNascimento;
            existing.Genero = paciente.Genero;
            existing.RG = paciente.RG;
            existing.UfRg = paciente.UfRg;
            existing.Email = paciente.Email;
            existing.Celular = paciente.Celular;
            existing.Telefone = paciente.Telefone;
            existing.ConvenioId = paciente.ConvenioId;
            existing.NumeroCarteirinha = paciente.NumeroCarteirinha;
            existing.ValidadeCarteirinha = paciente.ValidadeCarteirinha;
            existing.Ativo = paciente.Ativo;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/inativar")]
        public async Task<IActionResult> Inativar(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null) return NotFound();

            paciente.Ativo = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
