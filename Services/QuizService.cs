using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IQuestionRepository _questionRepository;

        public QuizService(IQuizRepository quizRepository, IQuestionRepository questionRepository)
        {
            _quizRepository = quizRepository;
            _questionRepository = questionRepository;
        }

        public void Add(Quiz quiz)
        {
            _quizRepository.Add(quiz);
        }

        public void Delete(Quiz quiz)
        {
            _quizRepository.Delete(quiz);
        }

        public Quiz? FindById(Guid id)
        {
            return _quizRepository.FindById(id);
        }

        public IEnumerable<Quiz> GetAll(User owner)
        {
            return _quizRepository.FindAllOfUser(owner);
        }

        public bool ValidateQuiz(Quiz quiz)
        {
            if (quiz.Questions is not null)
            {
                if (quiz.Questions.Count < 1)
                {
                    return false;
                }
                foreach (var question in quiz.Questions)
                {
                    if (question.Answers is not null && question.Answers.Count != 4)
                    {
                        return false;
                    }
                }
            }
            return true;
        }


        public void Update(Quiz quiz)
        {
            var existingQuiz = FindById(quiz.Id);

            if (existingQuiz == null || existingQuiz.ReadOnly)
            {
                throw new InvalidOperationException();
            }

            if (existingQuiz != null)
            {
                existingQuiz.Title = quiz.Title;
                existingQuiz.Description = quiz.Description;
                existingQuiz.ReadOnly = quiz.ReadOnly;
                _quizRepository.Update(existingQuiz);
                var questions = _questionRepository.FindAllOfQuiz(existingQuiz.Id);
                if (ReferenceEquals(quiz, existingQuiz) == false)
                {
                    if (questions is not null)
                    {
                        foreach (var question in questions)
                        {
                            _questionRepository.Delete(question);
                        }
                    }
                    if (quiz.Questions is not null)
                    {
                        foreach (var newQuestion in quiz.Questions)
                        {
                            newQuestion.Quiz = existingQuiz;
                            _questionRepository.Add(newQuestion);
                        }
                    }
                }
            }
        }

        public Quiz? FindQuizById(Guid id)
        {
            return _quizRepository.FindQuizById(id);
        }
    }
}
