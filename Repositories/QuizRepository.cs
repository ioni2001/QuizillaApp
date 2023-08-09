using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class QuizRepository: IQuizRepository
    {
        protected readonly DbContext _context;

        public QuizRepository(DbContext context)
        {
            _context = context;
        }

        public void Add(Quiz entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(Quiz entity)
        {
            _context.Set<Quiz>().Remove(entity);
            _context.SaveChanges();
        }

        public IEnumerable<Quiz> FindAll()
        {
            return _context.Set<Quiz>().ToList();
        }

        public IEnumerable<Quiz> FindAllOfUser(User owner)
        {
            return _context.Set<Quiz>().Where(quiz => quiz.Owner == owner).Include(q => q.Questions).ThenInclude(q => q.Answers).ToList();
        }

        public Quiz? FindById(Guid id)
        {
            return _context.Set<Quiz>().Find(id);
        }

        public Quiz FindQuizById(Guid id)
        {
            return _context.Set<Quiz>().Where(quiz => quiz.Id == id).Include(q => q.Owner).Include(q => q.Questions).ThenInclude(q => q.Answers).FirstOrDefault();
        }

        public void Update(Quiz entity)
        {
            _context.Set<Quiz>().Attach(entity);
            var entry = _context.Entry(entity);
            entry.State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
