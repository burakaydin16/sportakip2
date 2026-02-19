using System;
using System.ComponentModel.DataAnnotations;

namespace PilatesApi.Models
{
    public enum SessionStatus
    {
        SCHEDULED,
        ATTENDED,
        MISSED,
        INSTRUCTOR_CANCELLED,
        RESCHEDULED
    }

    public class Session
    {
        public Guid Id { get; set; }
        [Required]
        public Guid AthleteId { get; set; }
        [Required]
        public string Date { get; set; } // ISO string format
        [Required]
        public string Time { get; set; }
        public int Duration { get; set; }
        public string Status { get; set; } = "SCHEDULED";
        public string? OriginalDate { get; set; }
        public string? Notes { get; set; }
    }
}
