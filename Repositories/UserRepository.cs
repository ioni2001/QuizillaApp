using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        protected readonly DbContext _context;

        public UserRepository(DbContext context)
        {
            _context = context;
        }

        public void Add(User entity)
        {
            _context.Add<User>(entity);
            _context.SaveChanges();
        }

        public void Delete(User entity)
        {
            _context.Remove<User>(entity);
            _context.SaveChanges();
        }

        public IEnumerable<User> FindAll()
        {
            return _context.Set<User>().ToList();
        }

        public User? FindById(Guid id)
        {
            return _context.Set<User>().Find(id);
        }

        public User? FindByEmail(string email)
        {
            return _context.Set<User>().Where(x => x.Email == email).FirstOrDefault();
        }

        public IEnumerable<User> FindByName(string name)
        {
            return _context.Set<User>().Where(x => x.Name == name).ToList();
        }

        public void Update(User entity)
        {
            _context.Attach(entity);
            var entry = _context.Entry(entity);
            entry.State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
