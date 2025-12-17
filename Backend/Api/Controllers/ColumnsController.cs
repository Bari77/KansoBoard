using Api.Extensions;
using Application.Authorization;
using Application.Columns;
using Application.Mapping;
using Contracts.Columns;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

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

        var result = await service.GetByBoardAsync(boardId);
        return Ok(result.Select(Mapper.ToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var projectId = await resolver.GetProjectIdFromColumn(id);
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

        var col = await service.GetByIdAsync(id);
        return col is null ? NotFound() : Ok(Mapper.ToDto(col));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateColumnRequest req)
    {
        var projectId = await resolver.GetProjectIdFromBoard(req.BoardId);
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

        var col = await service.CreateAsync(req.BoardId, req.Name);
        return CreatedAtAction(nameof(GetById), new { id = col.Id }, Mapper.ToDto(col));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateColumnRequest req)
    {
        var projectId = await resolver.GetProjectIdFromColumn(id);
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

        var col = await service.UpdateAsync(id, req.Name);
        return col is null ? NotFound() : Ok(Mapper.ToDto(col));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var projectId = await resolver.GetProjectIdFromColumn(id);
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

        return await service.DeleteAsync(id) ? NoContent() : NotFound();
    }

    [HttpPost("{id:guid}/reorder")]
    public async Task<IActionResult> Reorder(Guid id, List<ColumnOrderDto> orders)
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

        return await service.ReorderAsync(id, orders) ? NoContent() : NotFound();
    }
}