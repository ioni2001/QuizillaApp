using Backend.Models;

namespace Backend.Services
{
    public interface IRoomService
    {
        Room CreateRoom(Guid quizId);
        Room? GetRoomById(Guid roomId);
        Room? GetRoomByPin(int pin);

        void UpdateRoom(Room room);
    }
}
