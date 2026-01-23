using KansoBoard.Api.Extensions;
using KansoBoard.Application.Authorization;
using KansoBoard.Application.Mapping;
using KansoBoard.Application.ProjectUsers;
using KansoBoard.Contracts.ProjectUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectUsersController(IProjectUserService service, IProjectAuthorizationService auth) : ControllerBase
{
    [HttpGet("{projectId:guid}/users")]
    public async Task<IActionResult> GetUsers(Guid projectId)
    {
        var apiProjectId = User.FindFirst("ApiProjectId")?.Value;
        if (apiProjectId is not null)
        {
            if (Guid.Parse(apiProjectId) != projectId)
                return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId)) return Forbid();
        }

        var result = await service.GetUsersAsync(projectId);
        return Ok(result.Select(Mapper.ToDto));
    }

    [HttpPost("{projectId:guid}/add")]
    public async Task<IActionResult> AddUser(Guid projectId, AddUserRequest req)
    {
        var apiProjectId = User.FindFirst("ApiProjectId")?.Value;
        if (apiProjectId is not null)
        {
            if (Guid.Parse(apiProjectId) != projectId)
                return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId)) return Forbid();
        }

        return await service.AddUserAsync(projectId, req.UserId) ? Ok() : BadRequest();
    }

    [HttpPost("{projectId:guid}/remove")]
    public async Task<IActionResult> RemoveUser(Guid projectId, RemoveUserRequest req)
    {
        var apiProjectId = User.FindFirst("ApiProjectId")?.Value;
        if (apiProjectId is not null)
        {
            if (Guid.Parse(apiProjectId) != projectId)
                return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId)) return Forbid();
        }

        return await service.RemoveUserAsync(projectId, req.UserId) ? Ok() : NotFound();
    }
}