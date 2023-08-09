using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        protected readonly DbContext Context;

        public RoomRepository(DbContext context)
        {
            Context = context;
        }
        public void Add(Room entity)
        {
            Context.Set<Room>().Add(entity);
            Context.SaveChanges();
        }

        public void Delete(Room entity)
        {
            if(entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            Context.Set<Room>().Remove(entity);
            Context.SaveChanges();
        }

        public IEnumerable<Room> FindAll()
        {
           return Context.Set<Room>().ToList();
        }

        public Room? FindById(Guid id)
        {
            return Context.Set<Room>().Find(id);
        }

        public void Update(Room entity)
        {
           if(entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

           Context.Set<Room>().Attach(entity);
           var entry = Context.Entry(entity);
           entry.State = EntityState.Modified;
           Context.SaveChanges();
        }

        public Room? GetRoomById(Guid id)
        {
            return Context.Set<Room>().Where(r =>  r.Id == id).Include(r => r.Quiz).ThenInclude(q => q.Questions).ThenInclude(q => q.Answers).Include(r => r.Players).FirstOrDefault();
        }

        public Room? GetRoomByPin(int pin)
        {
            return Context.Set<Room>().Where(r => r.Pin == pin).FirstOrDefault();
        }

        public Room? FindRoomByPlayerConnectionId(string connectionId)
        {
            return Context.Set<Room>()
                  .Include(r => r.Players)
                  .FirstOrDefault(r => r.Players.Any(p => p.connectionId == connectionId));
        }
    }
}
