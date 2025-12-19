using KansoBoard.Api.Extensions;
using KansoBoard.Application.Auth;
using KansoBoard.Application.Authorization;
using KansoBoard.Application.Invitations;
using KansoBoard.Contracts.Invitations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvitationsController(IInvitationService service, IAuthService authService, IProjectAuthorizationService auth) : ControllerBase
{
    [HttpPost("{projectId:guid}/create")]
    public async Task<IActionResult> Create(Guid projectId, CreateInvitationRequest req)
    {
        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != projectId) return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId)) return Forbid();
        }

        var token = await service.CreateAsync(projectId, req.Lifetime);
        return Ok(token);
    }

    [HttpPost("consume")]
    public async Task<IActionResult> Consume(ConsumeInvitationRequest req)
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        if (authHeader is null) return Unauthorized();

        var token = authHeader.Replace("Bearer ", "");
        var user = await authService.GetUserFromTokenAsync(token);
        if (user is null) return Unauthorized();

        var consumeResult = await service.ConsumeAsync(req.Token, user.Id);
        return consumeResult != null ? Ok(consumeResult) : BadRequest();
    }
}