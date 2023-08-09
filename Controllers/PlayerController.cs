using Backend.Models;
using Backend.Models.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerService _playerService;

        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpPut]
        [Route("answerQuestion/{id}")]
        public ActionResult<int> AnswerQuestion([FromRoute] Guid id, [FromBody] AnswerDTO answer)
        {
            if(answer is null)
            {
                return BadRequest();
            }

            var score = _playerService.AnswerQuestion(id, answer.QuestionId, answer.AnswerId, answer.Time);
            return Ok(score);
        }
    }
}
