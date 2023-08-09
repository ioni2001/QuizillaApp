using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IUserService _userService;

        public RoomController(IRoomService roomService, IUserService userService)
        {
            _roomService = roomService;
            _userService = userService;
        }

        [HttpPost]
        [Route("create/{quizId}")]
        public ActionResult<Room> Create([FromRoute] Guid quizId)
        {
            var token = HttpContext.Request.Cookies?["jwt_token"];
            var ownerId = _userService.GetGuidFromToken(token);
            if (ownerId == null)
            {
                return BadRequest();
            }

            var room = _roomService.CreateRoom(quizId);
            
            if(room is null)
            {
                return BadRequest();
            }

            return Ok(room);
        }

        [HttpGet]
        [Route("get/{roomId}")]
        public ActionResult<Room> GetRoom([FromRoute] Guid roomId)
        {
            var token = HttpContext.Request.Cookies?["jwt_token"];
            var ownerId = _userService.GetGuidFromToken(token);
            if (ownerId == null)
            {
                return BadRequest();
            }

            var room = _roomService.GetRoomById(roomId);

            if(room is null)
            {
                return BadRequest();
            }

            return Ok(room);
        }

        [HttpGet]
        [Route("getbypin/{pin}")]
        public ActionResult<Room> GetRoomByPin([FromRoute] int pin)
        {
            var room = _roomService.GetRoomByPin(pin);

            if (room is null)
            {
                return BadRequest();
            }

            return Ok(room);
        }
    }
}
