using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesApi.Data;
using PilatesApi.Models;

namespace PilatesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AthletesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AthletesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Athlete>>> GetAthletes()
        {
            return await _context.Athletes
                .Where(a => a.IsActive)
                .OrderBy(a => a.Name)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Athlete>> PostAthlete(Athlete athlete)
        {
            athlete.Id = Guid.NewGuid();
            athlete.CreatedAt = DateTime.UtcNow;
            _context.Athletes.Add(athlete);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAthletes), new { id = athlete.Id }, athlete);
        }

        [HttpPost("{id}/soft-delete")]
        public async Task<IActionResult> SoftDeleteAthlete(Guid id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return NotFound();

            athlete.IsActive = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAthlete(Guid id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return NotFound();

            _context.Athletes.Remove(athlete);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
