using KansoBoard.Api.Extensions;
using KansoBoard.Application.Authorization;
using KansoBoard.Application.Columns;
using KansoBoard.Application.Mapping;
using KansoBoard.Contracts.Columns;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ColumnsController(IColumnService service, IProjectAuthorizationService auth, IProjectContextResolver resolver) : ControllerBase
{
    [HttpGet("board/{boardId:guid}")]
    public async Task<IActionResult> GetByBoard(Guid boardId)
    {
        var projectId = await resolver.GetProjectIdFromBoard(boardId);
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

        var result = await service.GetByBoardAsync(boardId);
        return Ok(result.Select(Mapper.ToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var projectId = await resolver.GetProjectIdFromColumn(id);
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

        var col = await service.GetByIdAsync(id);
        return col is null ? this.NotFoundError("ERR_COLUMN_NOT_FOUND") : Ok(Mapper.ToDto(col));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateColumnRequest req)
    {
        var projectId = await resolver.GetProjectIdFromBoard(req.BoardId);
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

        var col = await service.CreateAsync(req.BoardId, req.Name);
        return CreatedAtAction(nameof(GetById), new { id = col.Id }, Mapper.ToDto(col));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateColumnRequest req)
    {
        var projectId = await resolver.GetProjectIdFromColumn(id);
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

        var col = await service.UpdateAsync(id, req.Name);
        return col is null ? this.NotFoundError("ERR_COLUMN_NOT_FOUND") : Ok(Mapper.ToDto(col));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var projectId = await resolver.GetProjectIdFromColumn(id);
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

        return await service.DeleteAsync(id) ? NoContent() : this.NotFoundError("ERR_COLUMN_NOT_FOUND");
    }

    [HttpPost("{id:guid}/reorder")]
    public async Task<IActionResult> Reorder(Guid id, List<ColumnOrderDto> orders)
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

        return await service.ReorderAsync(id, orders) ? NoContent() : this.NotFoundError("ERR_COLUMN_NOT_FOUND");
    }
}