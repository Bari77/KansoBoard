using System.Security.Claims;

namespace Api.Extensions;

public static class UserExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal user)
    {
        var id = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                 ?? user.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

        return id is null ? null : Guid.Parse(id);
    }
}
