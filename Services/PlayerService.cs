using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IAnswerRepository _answerRepository;

        public PlayerService(IPlayerRepository playerRepository, IRoomRepository roomRepository, IQuestionRepository questionRepository, IAnswerRepository answerRepository) 
        {
            _playerRepository = playerRepository;
            _roomRepository = roomRepository;
            _questionRepository = questionRepository;
            _answerRepository = answerRepository;
        }

        public ICollection<Player> Add(string name, string connectionId, Guid roomId)
        {
            var room = _roomRepository.GetRoomById(roomId);
            
            if(room != null )
            {
                var player = new Player
                {
                    Name = name,
                    connectionId = connectionId,
                    Room = room,
                    Score = 0
                };

               _playerRepository.Add(player);
                room.Players.Add(player);
                return room.Players;
            }
            return null;
        }

        public int AnswerQuestion(Guid playerId, Guid questionId, Guid answerId, int time)
        {
            var player = _playerRepository.FindById(playerId);
            var question = _questionRepository.FindById(questionId);
            var chosenAnswer = _answerRepository.FindById(answerId);
            var allAnswersOfQuestion = _answerRepository.FindAllOfQuestion(questionId);

            if (allAnswersOfQuestion.FirstOrDefault(a => a.Id == answerId) is null)
            {
                throw new ArgumentNullException();
            }

            if (!chosenAnswer.IsCorect || time >= question.Time)
            {
                return 0;
            }

            float calculatedScore = (1 - ((float)time / question.Time / 2)) * 1000 + 0.5f;
            player.Score = player.Score + (int)calculatedScore;
            UpdatePlayer(player);
            return (int)calculatedScore;
        }

        public void UpdatePlayer(Player player)
        {
            var existingPlayer = _playerRepository.FindById(player.Id);

            if (existingPlayer != null)
            {
                existingPlayer.Score = player.Score;
                existingPlayer.Name = player.Name;
                _playerRepository.Update(player);
            }
        }

        public void Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public Room DeletePlayerByConnectionId(string connectionId)
        {
            var roomId = _roomRepository.FindRoomByPlayerConnectionId(connectionId).Id;
            _playerRepository.DeletePlayerByConnectionId(connectionId);
            return _roomRepository.GetRoomById(roomId);
        }

        public Player? FindById(Guid id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Player> GetSortedPlayers(Guid roomId)
        {
            return _playerRepository.GetSortedPlayers(roomId);
        }
    }
}
