using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("quizzes")]

    public class Quiz
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        [ForeignKey("ownerId")]
        [JsonIgnore]
        public User? Owner { get; set; }

        public bool ReadOnly { get; set; }
        public ICollection<Question>? Questions { get; set; } = null!;
    }
}
