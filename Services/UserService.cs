using Backend.Authorization;
using Backend.Models;
using Backend.Models.DTO;
using Backend.Repositories;
using BCrypt.Net;

namespace Backend.Services
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtToken _jwtToken;

        public UserService(IUserRepository userRepository, IJwtToken jwtToken)
        {
            _userRepository = userRepository;
            _jwtToken = jwtToken;
        }

        public string GenerateJwtToken(Guid? id)
        {
            return _jwtToken.GenerateJwt(id);
        }

        public AuthenticationResultDTO SignUp(UserSignupDTO user)
        {
            if(_userRepository.FindByEmail(user.Email) != null)
            {
                return AuthenticationResultDTO.GetAuthenticationResponse("This email address is already in use!", null);
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            var userToAdd = new User(String.Format("{0} {1}", user.FirstName, user.LastName), user.Email, user.Password);
            _userRepository.Add(userToAdd);
            return AuthenticationResultDTO.GetAuthenticationResponse(null, userToAdd.Id);
        }

        public AuthenticationResultDTO Login(CredentialsDTO credentials)
        {
            var user = _userRepository.FindByEmail(credentials.Email);
            if(user == null)
            {
                return AuthenticationResultDTO.GetAuthenticationResponse("The given combination of email address and password is invalid!", null);
            }
            var success = BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password);
            if(success)
            {
                return AuthenticationResultDTO.GetAuthenticationResponse(null, user.Id);
            }
            return AuthenticationResultDTO.GetAuthenticationResponse("The given combination of email address and password is invalid!", null);
        }

        public User? FindById(Guid id)
        {
            var user = _userRepository.FindById(id);
            if(user == null)
            {
                return null;
            }
            return user;
        }

        public bool ValidateToken(string? token)
        {

            if (token == null)
            {
                return false;
            }
            if (_jwtToken.Validate(token) == null)
            {
                return false;
            }
            return true;
        }

        public Guid? GetGuidFromToken(string token)
        {
            return _jwtToken.GetGuidFromToken(token);
        }
    }
}
