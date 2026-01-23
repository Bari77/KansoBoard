using KansoBoard.Api.Extensions;
using KansoBoard.Application.Authorization;
using KansoBoard.Application.Boards;
using KansoBoard.Application.Mapping;
using KansoBoard.Contracts.Boards;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BoardsController(IBoardService service, IProjectAuthorizationService auth, IProjectContextResolver resolver) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var projectId = await resolver.GetProjectIdFromBoard(id);
        if (projectId is null) return Forbid();

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
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId.Value)) return Forbid();
        }

        var board = await service.GetByIdAsync(id);
        return board is null ? NotFound() : Ok(Mapper.ToDto(board));
    }

    [HttpGet("project/{projectId:guid}")]
    public async Task<IActionResult> GetByProject(Guid projectId)
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

        var boards = await service.GetByProjectAsync(projectId);
        return Ok(boards.Select(Mapper.ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBoardRequest request)
    {
        var apiProjectId = User.FindFirst("ApiProjectId")?.Value;
        if (apiProjectId is not null)
        {
            if (Guid.Parse(apiProjectId) != request.ProjectId)
                return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, request.ProjectId)) return Forbid();
        }

        var board = await service.CreateAsync(request.ProjectId, request.Name);
        return CreatedAtAction(nameof(GetById), new { id = board.Id }, Mapper.ToDto(board));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBoardRequest request)
    {
        var projectId = await resolver.GetProjectIdFromBoard(id);
        if (projectId is null) return Forbid();

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
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId.Value)) return Forbid();
        }

        var board = await service.UpdateAsync(id, request.Name);
        return board is null ? NotFound() : Ok(Mapper.ToDto(board));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var projectId = await resolver.GetProjectIdFromBoard(id);
        if (projectId is null) return Forbid();

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
            if (!await auth.CanAccessProjectAsync(userId.Value, projectId.Value)) return Forbid();
        }

        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
