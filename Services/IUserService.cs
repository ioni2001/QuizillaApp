using Backend.Models;
using Backend.Models.DTO;
using Microsoft.Identity.Client;

namespace Backend.Services
{
    public interface IUserService
    {
        AuthenticationResultDTO SignUp(UserSignupDTO user);
        AuthenticationResultDTO Login(CredentialsDTO credentials);
        string GenerateJwtToken(Guid? id);
        User? FindById(Guid id);
        bool ValidateToken(string? token);
        Guid? GetGuidFromToken(string token);
    }
}
