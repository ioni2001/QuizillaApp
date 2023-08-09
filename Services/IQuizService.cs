using Backend.Models;

namespace Backend.Services
{
    public interface IQuizService
    {
        void Add(Quiz quiz);
        void Update(Quiz quiz);
        void Delete(Quiz quiz);
        Quiz? FindById(Guid id);
        IEnumerable<Quiz> GetAll(User owner);
        bool ValidateQuiz(Quiz quiz);
        Quiz? FindQuizById(Guid id);
    }
}
