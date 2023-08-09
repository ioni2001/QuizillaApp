namespace Backend.Models.DTO
{
    public class AuthenticationResultDTO
    {
        public bool IsSucces { get; set; }
        public string? Error { get; set; }
        public Guid? Id { get; set; } = null!;

        public static AuthenticationResultDTO GetAuthenticationResponse(string? error, Guid? id)
        {
            return new AuthenticationResultDTO
            {
                IsSucces = error == null,
                Error = error,
                Id = id
            };
        }
    }
}
