using Backend.Authorization;
using Microsoft.AspNetCore.Authentication;

namespace Backend.Middlewares
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IJwtToken _token;
        private readonly List<string> _availablePaths;

        public AuthenticationMiddleware(RequestDelegate next, IJwtToken token)
        {
            _next = next;
            _token = token;
            _availablePaths = new List<string>()
            {
                "Quiz"
            };
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var path = httpContext.Request.Path.Value?.Split("/").Where((partFromPath) => partFromPath != string.Empty).ToList();
            if(path is null)
            {
                httpContext.Response.StatusCode = 400;
                httpContext.Response.ContentType = "test/plain";
                await httpContext.Response.WriteAsync("Bad Request");
                return;
            }
            if (_availablePaths.Contains(path[0]))
            {
                var jwtToken = httpContext.Request.Cookies["jwt_token"]?.ToString();
                if(jwtToken is null || jwtToken.Length == 0)
                {
                    httpContext.Response.StatusCode = 400;
                    httpContext.Response.ContentType = "test/plain";
                    await httpContext.Response.WriteAsync("Bad Request");
                    return;
                }
                if(_token.Validate(jwtToken) is null)
                {
                    httpContext.Response.StatusCode = 403;
                    httpContext.Response.ContentType = "test/plain";
                    await httpContext.Response.WriteAsync("Forbidden");
                    return;
                }
            }
            await _next(httpContext);
        }
    }
    public static class UserMiddlewareExtensions
    {
        public static IApplicationBuilder UseUserMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthenticationMiddleware>();
        }
    }
}
