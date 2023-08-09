using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("questions")]
    public class Question
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public int Time { get; set; }

        [ForeignKey("quizId")]
        [JsonIgnore]
        public Quiz? Quiz { get; set; }

        public ICollection<Answer>? Answers { get; set; } = null!;

    }
}
