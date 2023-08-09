using Backend.Models;

namespace Backend.Repositories
{
    public interface IRoomRepository: IRepository<Room>
    {
        Room? GetRoomById(Guid id);
        Room? GetRoomByPin(int pin);
        Room? FindRoomByPlayerConnectionId(string connectionId);
    }
}
