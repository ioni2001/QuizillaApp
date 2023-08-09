using Backend.Models;

namespace Backend.Repositories
{
    public interface IPlayerRepository : IRepository<Player>
    {
        void DeletePlayerByConnectionId(string connectionId);
        IEnumerable<Player> GetSortedPlayers(Guid roomId);
    }
}
