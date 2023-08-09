using System.IdentityModel.Tokens.Jwt;

namespace Backend.Authorization
{
    public interface IJwtToken
    {
        string GenerateJwt(Guid? id);
        JwtSecurityToken Validate(string token);
        Guid? GetGuidFromToken(string token);
    }
}
