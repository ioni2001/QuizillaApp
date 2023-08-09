using Backend.Models;
using Backend.Models.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace Backend.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController: ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Route("signup")]
        public ActionResult<AuthenticationResultDTO> SignUp([FromBody] UserSignupDTO user)
        {
            var result = _userService.SignUp(user);
            if(result.IsSucces == true)
            {
                var token = _userService.GenerateJwtToken(result.Id);
                Response.Cookies.Append("jwt_token", token, new CookieOptions
                {
                    HttpOnly = true,
                    Domain = "localhost",
                    SameSite = SameSiteMode.None,
                    Secure = true
                });
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost]
        [Route("login")]
        public ActionResult<AuthenticationResultDTO> Login([FromBody] CredentialsDTO credentials)
        {
            var result = _userService.Login(credentials);
            if (result.IsSucces == true)
            {
                var token = _userService.GenerateJwtToken(result.Id);
                Response.Cookies.Append("jwt_token", token, new CookieOptions
                {
                    HttpOnly= true,
                    Domain = "localhost",
                    SameSite = SameSiteMode.None,
                    Secure = true
                });
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<User> FindById([FromRoute] Guid id)
        {
            var token = Request.Cookies?["jwt_token"];
            if (!_userService.ValidateToken(token))
            {
                return Forbid();
            }
            var user = _userService.FindById(id);
            if(user == null)
            {
                return BadRequest("User doesn't exist");
            }
            return Ok(user);
        }

        [HttpPost]
        [Route("logout")]
        public ActionResult Logout()
        {
            var token = Request.Cookies?["jwt_token"];
            if (!_userService.ValidateToken(token))
            {
                return Forbid();
            }
            Response.Cookies.Delete("jwt_token", new CookieOptions
            {
                HttpOnly = true,
                Domain = "localhost",
                SameSite = SameSiteMode.None,
                Secure = true
            });
            return Ok();
        }
    }
}
