using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Player
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Score { get; set; }
        public string? connectionId { get; set; }

        [JsonIgnore]
        [ForeignKey("RoomId")]
        public virtual Room? Room { get; set; } = null!;
    }
}
