using Backend.Models;

namespace Backend.Repositories
{
    public interface IQuestionRepository: IRepository<Question>
    {
        IEnumerable<Question> FindAllOfQuiz(Guid quizId);
    }
}
