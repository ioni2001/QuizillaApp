using Backend.Models;

namespace Backend.Repositories
{
    public interface IUserRepository: IRepository<User>
    {
        User? FindByEmail(string email);
        IEnumerable<User> FindByName(string name);
    }
}
