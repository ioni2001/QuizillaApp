using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ML;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuizController: ControllerBase
    {
        private readonly IQuizService _quizService;
        private readonly IUserService _userService;

        public QuizController(IQuizService quizService, IUserService userService)
        {
            _quizService = quizService;
            _userService = userService;
        }

        [HttpGet]
        [Route("get/{id}")]
        public ActionResult<Quiz> GetQuiz([FromRoute] Guid id) 
        {
            var token = HttpContext.Request.Cookies?["jwt_token"];
            var ownerId = _userService.GetGuidFromToken(token);
            if (ownerId == null)
            {
                return BadRequest();
            }
            var owner = _userService.FindById((Guid)ownerId);
            if (owner == null)
            {
                return NotFound("User not found!");
            }
            var quiz = _quizService.FindQuizById(id);
            if(quiz == null) 
            {
                return NotFound("Quiz not found!");
            }
            return Ok(quiz);
        }

        [HttpGet]
        [Route("get")]
        public ActionResult<List<Quiz>> Get() 
        {
            var token = HttpContext.Request.Cookies?["jwt_token"];
            var ownerId = _userService.GetGuidFromToken(token);
            if (ownerId == null)
            {
                return BadRequest();
            }
            var owner = _userService.FindById((Guid)ownerId);
            if (owner == null)
            {
                return NotFound("User not found!");
            }
            var quizzes = _quizService.GetAll(owner);
            return Ok(quizzes);
        }

        [HttpPost]
        [Route("add")]
        public ActionResult Add([FromBody] Quiz quiz)
        {
            if(quiz is null)
            {
                return BadRequest("Quiz is null!");
            }
            var token = HttpContext.Request.Cookies?["jwt_token"];
            var ownerId = _userService.GetGuidFromToken(token);
            if(ownerId == null)
            {
                return BadRequest("Id is null!");
            }
            var owner = _userService.FindById((Guid)ownerId);
            if(owner == null)
            {
                return NotFound();
            }
            if (!_quizService.ValidateQuiz(quiz))
            {
                return BadRequest("Quiz must contain at least one question and four answers.");
            }
            quiz.Owner = owner;
            _quizService.Add(quiz);
            return Ok();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public ActionResult Delete([FromRoute] Guid id)
        {
            var quiz = _quizService.FindById(id);
            if(quiz is null) 
            { 
                return NotFound();
            }
            _quizService.Delete(quiz);
            return Ok();
        }

        [HttpPut]
        [Route("update")]
        public ActionResult Update([FromBody] Quiz quiz)
        {
            if (quiz is null)
            {
                return BadRequest();
            }
            if (_quizService.FindById(quiz.Id) is null)
            {
                return NotFound();
            }
            if (!_quizService.ValidateQuiz(quiz))
            {
                return BadRequest("Quiz must contain at least one question and four answers.");
            }
            _quizService.Update(quiz);
            return Ok();
        }
    }
}