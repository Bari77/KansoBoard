using Api.Extensions;
using Application.Authorization;
using Application.Boards;
using Application.Mapping;
using Contracts.Boards;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

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

        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != projectId) return Forbid();
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

        var boards = await service.GetByProjectAsync(projectId);
        return Ok(boards.Select(Mapper.ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBoardRequest request)
    {
        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != request.ProjectId) return Forbid();
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

        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != projectId) return Forbid();
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

        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != projectId) return Forbid();
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
