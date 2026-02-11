using KansoBoard.Api.Extensions;
using KansoBoard.Application.ApiKeys;
using KansoBoard.Application.Authorization;
using KansoBoard.Contracts.ApiKeys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KansoBoard.Api.Controllers;

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

        return Ok(await service.CreateAsync(projectId, req.Lifetime));
    }

    [HttpPost("{projectId:guid}/revoke")]
    public async Task<IActionResult> Revoke(Guid projectId, RevokeApiKeysRequest req)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        if (!await auth.CanAccessProjectAsync(userId.Value, projectId))
            return Forbid();

        return await service.RevokeAsync(req.Key) ? Ok() : this.NotFoundError("ERR_API_KEY_NOT_FOUND");
    }

    [HttpGet("{projectId:guid}")]
    public async Task<IActionResult> Get(Guid projectId)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        if (!await auth.CanAccessProjectAsync(userId.Value, projectId))
            return Forbid();

        return Ok(await service.GetAsync(projectId));
    }
}
