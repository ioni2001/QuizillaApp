using Backend.Models;

namespace Backend.Repositories
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        IEnumerable<Quiz> FindAllOfUser(User owner);
        Quiz FindQuizById(Guid id);
    }
}
