using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        protected readonly DbContext _context;
        public PlayerRepository(DbContext context) 
        {
            _context = context;
        }
        public void Add(Player entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(Player entity)
        {
            _context.Set<Player>().Remove(entity);
            _context.SaveChanges();
        }

        public void DeletePlayerByConnectionId(string connectionId)
        {
            var player = _context.Set<Player>().Where(p => p.connectionId == connectionId).Include(p => p.Room).FirstOrDefault();

            if (player != null)
            {
                Delete(player);
            }
        }

        public IEnumerable<Player> FindAll()
        {
            return _context.Set<Player>().ToList();
        }

        public Player? FindById(Guid id)
        {
            return _context.Set<Player>().Find(id);
        }

        public IEnumerable<Player> GetSortedPlayers(Guid roomId)
        {
            return _context.Set<Player>().Where(p => p.Room.Id == roomId).AsEnumerable().OrderByDescending(p => p.Score).ToList();
        }

        public void Update(Player entity)
        {
            _context.Set<Player>().Attach(entity);
            var entry = _context.Entry(entity);
            entry.State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
