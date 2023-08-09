using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IRoomService _roomService;
        private readonly IPlayerService _playerService;
        public MessageHub(IRoomService roomService, IPlayerService playerService) 
        {
            _roomService = roomService;
            _playerService = playerService;
        }

        public async Task JoinRoom(string roomId, string name)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            if(name != "")
            {
                var players = _playerService.Add(name, Context.ConnectionId, Guid.Parse(roomId));
                await SendPlayers(roomId, players);
                await SendPlayerToSpecificConnection(Context.ConnectionId, players.ElementAt(players.Count - 1));
            }
        }

        public async Task SendPlayers(string roomId, ICollection<Player> players)
        {
            await Clients.Groups(roomId).SendAsync("SendPlayers", players);
        }

        public async Task SendPlayerToSpecificConnection(string connectionId, Player player)
        {
            await Clients.Client(connectionId).SendAsync("SendPlayerToSpecificConnection", player);
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var room = _playerService.DeletePlayerByConnectionId(Context.ConnectionId);
            await SendPlayers(room.Id.ToString(), room.Players);
        }

        public async Task UpdateStateQuiz(string roomId, RoomState roomState)
        {
            var room = _roomService.GetRoomById(Guid.Parse(roomId));
            room.State = roomState;
            _roomService.UpdateRoom(room);
            await Clients.Groups(roomId).SendAsync("UpdateStateQuiz", roomState);
        }

        public async Task SendQuestion(string roomId, Question question)
        {
            await Clients.Groups(roomId).SendAsync("SendQuestion", question);
        }

        public async Task SendSortedPlayers(string roomId)
        {
            var sortedPlayers = _playerService.GetSortedPlayers(Guid.Parse(roomId));
            await Clients.Groups(roomId).SendAsync("SendSortedPlayers", sortedPlayers);
        }

        public async Task SendFinishMessage(string roomId, RoomState roomState)
        {
            var sortedPlayers = _playerService.GetSortedPlayers(Guid.Parse(roomId));
            await SendFinalRanking(roomId, sortedPlayers);
            var room = _roomService.GetRoomById(Guid.Parse(roomId));
            room.State = roomState;
            _roomService.UpdateRoom(room);
        }

        public async Task SendFinalRanking(string roomId, IEnumerable<Player> sortedPlayers)
        {
            await Clients.Groups(roomId).SendAsync("SendFinalRanking", sortedPlayers);
        }
    }
}
