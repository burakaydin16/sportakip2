using Microsoft.EntityFrameworkCore;
using PilatesApi.Models;

namespace PilatesApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Athlete> Athletes { get; set; }
        public DbSet<Session> Sessions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Athlete>().ToTable("athletes");
            modelBuilder.Entity<Session>().ToTable("sessions");
            
            // Map property names to snake_case if your DB uses it
            modelBuilder.Entity<Athlete>().Property(a => a.Id).HasColumnName("id");
            modelBuilder.Entity<Athlete>().Property(a => a.Name).HasColumnName("name");
            modelBuilder.Entity<Athlete>().Property(a => a.Phone).HasColumnName("phone");
            modelBuilder.Entity<Athlete>().Property(a => a.Notes).HasColumnName("notes");
            modelBuilder.Entity<Athlete>().Property(a => a.IsActive).HasColumnName("is_active");
            modelBuilder.Entity<Athlete>().Property(a => a.CreatedAt).HasColumnName("created_at");

            modelBuilder.Entity<Session>().Property(s => s.Id).HasColumnName("id");
            modelBuilder.Entity<Session>().Property(s => s.AthleteId).HasColumnName("athlete_id");
            modelBuilder.Entity<Session>().Property(s => s.Date).HasColumnName("date");
            modelBuilder.Entity<Session>().Property(s => s.Time).HasColumnName("time");
            modelBuilder.Entity<Session>().Property(s => s.Duration).HasColumnName("duration");
            modelBuilder.Entity<Session>().Property(s => s.Status).HasColumnName("status");
            modelBuilder.Entity<Session>().Property(s => s.OriginalDate).HasColumnName("original_date");
            modelBuilder.Entity<Session>().Property(s => s.Notes).HasColumnName("notes");
        }
    }
}
