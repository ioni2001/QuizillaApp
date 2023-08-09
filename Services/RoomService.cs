using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IQuizRepository _quizRepository;

        public RoomService(IRoomRepository roomRepository, IQuizRepository quizRepository)
        {
            _roomRepository = roomRepository;
            _quizRepository = quizRepository;
        }

        public Room CreateRoom(Guid quizId)
        {
            var quiz = _quizRepository.FindById(quizId);
            var room = new Room();
            room.State = RoomState.Waiting;
            room.Quiz = quiz;
            var pinGenerator = new Random();
            int pin;
            Room foundRoom;
            do
            {
                pin = pinGenerator.Next(100000, 1000000);
                foundRoom = _roomRepository.FindAll().FirstOrDefault(x => (x.State == RoomState.Waiting || x.State == RoomState.Started) && x.Pin == pin);
            }while(foundRoom != null);
            room.Pin = pin;
            _roomRepository.Add(room);
            quiz.ReadOnly = true;
            return room;
        }

        public Room? GetRoomById(Guid roomId)
        {
            return _roomRepository.GetRoomById(roomId);
        }

        public Room? GetRoomByPin(int pin)
        {
            return _roomRepository.GetRoomByPin(pin);
        }

        public void UpdateRoom(Room room)
        {
            _roomRepository.Update(room);
        }
    }
}
