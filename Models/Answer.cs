using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("answers")]
    public class Answer
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Text { get; set; }
        [Required]
        public bool IsCorect { get; set; }

        [ForeignKey("questionId")]
        [JsonIgnore]
        public Question? Question { get; set; }
    }
}
