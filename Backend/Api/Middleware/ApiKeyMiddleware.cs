using Application.ApiKeys;

namespace Api.Middleware;

public class ApiKeyMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext ctx, IApiKeyService apiKeys)
    {
        if (ctx.Request.Headers.TryGetValue("Authorization", out var auth))
        {
            var raw = auth.ToString();

            if (raw.StartsWith("ApiKey "))
            {
                var key = raw.Substring("ApiKey ".Length).Trim();
                var projectId = await apiKeys.ValidateAsync(key);

                if (projectId is not null)
                {
                    ctx.Items["ApiProjectId"] = projectId.Value;
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
