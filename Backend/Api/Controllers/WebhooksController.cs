using Api.Extensions;
using Application.Authorization;
using Application.Webhooks;
using Contracts.Webhooks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WebhooksController(IWebhookService service, IProjectAuthorizationService auth) : ControllerBase
{
    [HttpPost("{projectId:guid}")]
    public async Task<IActionResult> Add(Guid projectId, AddWebhookRequest req)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        if (!await auth.CanAccessProjectAsync(userId.Value, projectId)) return Forbid();

        await service.AddAsync(projectId, req.Url);
        return Ok();
    }

    [HttpGet("{projectId:guid}")]
    public async Task<IActionResult> List(Guid projectId)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();
        if (!await auth.CanAccessProjectAsync(userId.Value, projectId)) return Forbid();

        return Ok(await service.GetUrlsAsync(projectId));
    }
}
