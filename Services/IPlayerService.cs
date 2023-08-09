using Backend.Models;

namespace Backend.Services
{
    public interface IPlayerService
    {
        ICollection<Player> Add(string name, string connectionId, Guid roomId);
        void Delete(Guid id);
        Player? FindById(Guid id);
        Room DeletePlayerByConnectionId(string connectionId);
        int AnswerQuestion(Guid playerId, Guid questionId, Guid answerId, int time);
        void UpdatePlayer(Player player);

        IEnumerable<Player> GetSortedPlayers(Guid roomId);
    }
}
