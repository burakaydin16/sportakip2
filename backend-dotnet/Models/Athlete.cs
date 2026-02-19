using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PilatesApi.Models
{
    public class Athlete
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Phone { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
