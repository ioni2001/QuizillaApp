using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Room
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public int Pin { get; set; }

        [Required]
        public RoomState State { get; set; }
        [ForeignKey("QuizId")]
        public virtual Quiz? Quiz { get; set; } = null!;
        public virtual ICollection<Player>? Players { get; set; } = null!;
    }
    public enum RoomState
    {
        Waiting,
        Started,
        Finished
    }
}
