 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/backend-dotnet/Controllers/SessionsController.cs b/backend-dotnet/Controllers/SessionsController.cs
index 0c75c3ae8dc1a040f70882fd1e73f2283eda6461..d3683e03c6ab48de37cb206a1a66657feb20887c 100644
--- a/backend-dotnet/Controllers/SessionsController.cs
+++ b/backend-dotnet/Controllers/SessionsController.cs
@@ -21,48 +21,48 @@ namespace PilatesApi.Controllers
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
-            return Ok();
+            return StatusCode(201);
         }
 
         [HttpPut("{id}")]
         public async Task<IActionResult> PutSession(Guid id, Session session)
         {
-            if (id != session.id) return BadRequest();
+            if (id != session.Id) return BadRequest();
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
 
EOF
)