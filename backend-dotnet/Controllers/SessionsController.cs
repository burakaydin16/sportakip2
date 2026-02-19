using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesApi.Data;
using PilatesApi.Models;

namespace PilatesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SessionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("athlete/{athleteId}")]
        public async Task<ActionResult<IEnumerable<Session>>> GetSessionsByAthlete(Guid athleteId)
        {
            return await _context.Sessions
                .Where(s => s.AthleteId == athleteId)
                .OrderBy(s => s.Date)
                .ThenBy(s => s.Time)
                .ToListAsync();
        }

        public class BulkSessionRequest
        {
            public Guid AthleteId { get; set; }
            public List<Session> Sessions { get; set; }
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> PostBulkSessions(BulkSessionRequest request)
        {
            foreach (var session in request.Sessions)
            {
                session.Id = Guid.NewGuid();
                session.AthleteId = request.AthleteId;
                session.Status = "SCHEDULED";
                _context.Sessions.Add(session);
            }
            await _context.SaveChangesAsync();
            return StatusCode(201);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSession(Guid id, Session session)
        {
            if (id != session.Id) return BadRequest();
            _context.Entry(session).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(Guid id)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null) return NotFound();
            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}