using Api.Extensions;
using Application.ApiKeys;
using Application.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApiKeysController(IApiKeyService service, IProjectAuthorizationService auth) : ControllerBase
{
    [HttpPost("{projectId:guid}")]
    public async Task<IActionResult> Create(Guid projectId, CreateApiKeysRequest req)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        if (!await auth.CanAccessProjectAsync(userId.Value, projectId))
            return Forbid();

        var key = await service.CreateAsync(projectId, req.Lifetime);
        return Ok(key);
    }

    [HttpPost("{projectId:guid}/revoke")]
    public async Task<IActionResult> Revoke(Guid projectId, RevokeApiKeysRequest req)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        if (!await auth.CanAccessProjectAsync(userId.Value, projectId))
            return Forbid();

        return await service.RevokeAsync(req.Key) ? Ok() : NotFound();
    }

    [HttpGet("{projectId:guid}")]
    public async Task<IActionResult> List(Guid projectId)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        if (!await auth.CanAccessProjectAsync(userId.Value, projectId))
            return Forbid();

        return Ok(await service.ListAsync(projectId));
    }
}

public record CreateApiKeysRequest(TimeSpan? Lifetime);

public record RevokeApiKeysRequest(string Key);