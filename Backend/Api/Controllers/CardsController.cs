using Api.Extensions;
using Application.Authorization;
using Application.Cards;
using Application.Mapping;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CardsController(ICardService service, IProjectAuthorizationService auth, IProjectContextResolver resolver) : ControllerBase
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
        var projectId = await resolver.GetProjectIdFromCard(id);
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

        var card = await service.GetByIdAsync(id);
        return card is null ? NotFound() : Ok(Mapper.ToDto(card));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCardRequest req)
    {
        var projectId = await resolver.GetProjectIdFromColumn(req.ColumnId);
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

        var card = await service.CreateAsync(req.ColumnId, req.Title, req.Description, req.Type, req.Priority);
        return CreatedAtAction(nameof(GetById), new { id = card.Id }, Mapper.ToDto(card));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateCardRequest req)
    {
        var projectId = await resolver.GetProjectIdFromCard(id);
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

        var card = await service.UpdateAsync(id, req.Title, req.Description, req.Type, req.Priority);
        return card is null ? NotFound() : Ok(Mapper.ToDto(card));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {

        var projectId = await resolver.GetProjectIdFromCard(id);
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

    [HttpPost("{id:guid}/assign")]
    public async Task<IActionResult> Assign(Guid id, AssignUserRequest req)
    {
        var projectId = await resolver.GetProjectIdFromCard(id);
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

        return await service.AssignAsync(id, req.UserId) ? Ok() : NotFound();
    }

    [HttpPost("{id:guid}/move")]
    public async Task<IActionResult> Move(Guid id, MoveCardRequest req)
    {
        var projectId = await resolver.GetProjectIdFromCard(id);
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

        return await service.MoveAsync(id, req.NewColumnId) ? Ok() : NotFound();
    }

    [HttpPost("{id:guid}/reorder")]
    public async Task<IActionResult> Reorder(Guid id, List<CardOrderDto> orders)
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

        return await service.ReorderAsync(id, orders) ? NoContent() : NotFound();
    }
}

public record CreateCardRequest(Guid ColumnId, string Title, string? Description, CardType Type, CardPriority Priority);

public record UpdateCardRequest(string Title, string? Description, CardType Type, CardPriority Priority);

public record AssignUserRequest(Guid? UserId);

public record MoveCardRequest(Guid NewColumnId);