using KansoBoard.Application.ApiKeys;
using System.Security.Claims;

namespace KansoBoard.Api.Middleware;

public class ApiKeyMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext ctx, IApiKeyService apiKeys)
    {
        if (ctx.Request.Headers.TryGetValue("Authorization", out var auth))
        {
            var raw = auth.ToString();

            if (raw.StartsWith("ApiKey "))
            {
                var key = raw["ApiKey ".Length..].Trim();
                var projectId = await apiKeys.ValidateAsync(key);

                if (projectId is not null)
                {
                    var claims = new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, projectId.Value.ToString()),
                        new Claim("ApiProjectId", projectId.Value.ToString())
                    };

                    var identity = new ClaimsIdentity(claims, "ApiKey");
                    ctx.User = new ClaimsPrincipal(identity);

                    await next(ctx);
                    return;
                }

                ctx.Response.StatusCode = 401;
                return;
            }
        }

        await next(ctx);
    }
}
