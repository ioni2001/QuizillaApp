using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AnswerRepository : IAnswerRepository
    {
        protected readonly DbContext _context;

        public AnswerRepository(DbContext context)
        {
            _context = context;
        }

        public void Add(Answer entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(Answer entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Answer> FindAll()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Answer> FindAllOfQuestion(Guid questionId)
        {
            return _context.Set<Answer>().Where(a => a.Question.Id == questionId).ToList();
        }

        public Answer? FindById(Guid id)
        {
            return _context.Set<Answer>().Find(id);
        }

        public void Update(Answer entity)
        {
            throw new NotImplementedException();
        }
    }
}
