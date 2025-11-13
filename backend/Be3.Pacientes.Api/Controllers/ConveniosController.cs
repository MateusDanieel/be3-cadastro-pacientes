using Microsoft.AspNetCore.Mvc;
using Be3.Pacientes.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Be3.Pacientes.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConveniosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConveniosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var convenios = await _context.Convenios.ToListAsync();
            return Ok(convenios);
        }
    }
}
