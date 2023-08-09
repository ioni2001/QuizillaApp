using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        protected readonly DbContext _context;

        public QuestionRepository(DbContext context)
        {
            _context = context;
        }

        public void Add(Question entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(Question entity)
        {
            _context.Set<Question>().Remove(entity);
            _context.SaveChanges();
        }

        public IEnumerable<Question> FindAll()
        {
            return _context.Set<Question>().ToList();
        }

        public IEnumerable<Question> FindAllOfQuiz(Guid quizId)
        {
            return _context.Set<Question>().Where(q => q.Quiz.Id.CompareTo(quizId) == 0).ToList();
        }

        public Question? FindById(Guid id)
        {
            return _context.Set<Question>().Find(id);
        }

        public void Update(Question entity)
        {
            _context.Set<Question>().Attach(entity);
            var entry = _context.Entry(entity);
            entry.State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
