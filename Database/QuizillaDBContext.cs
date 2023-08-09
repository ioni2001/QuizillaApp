using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public partial class QuizillaDBContext : DbContext
    {
        IConfiguration _configuration = null!;

        public QuizillaDBContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public QuizillaDBContext(DbContextOptions<QuizillaDBContext> options)
            :base(options) { }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Quiz> Quizzes { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<Answer> Answers { get; set; }
        public virtual DbSet<Room> Rooms { get; set; }
        public virtual DbSet<Player> Players { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseLazyLoadingProxies(false).UseSqlServer(_configuration.GetConnectionString("DatabaseConnection"));
            }
        }
    }
}
