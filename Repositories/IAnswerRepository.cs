using Backend.Models;

namespace Backend.Repositories
{
    public interface IAnswerRepository: IRepository<Answer>
    {
        IEnumerable<Answer> FindAllOfQuestion(Guid questionId);
    }
}
