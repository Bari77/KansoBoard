using KansoBoard.Api.Extensions;
using KansoBoard.Application.Authorization;
using KansoBoard.Application.Mapping;
using KansoBoard.Application.Projects;
using KansoBoard.Contracts.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectsController(IProjectService service, IProjectAuthorizationService auth) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var result = await service.GetAllAsync(userId.Value);
        return Ok(result.Select(Mapper.ToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != id) return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, id)) return Forbid();
        }

        var project = await service.GetByIdAsync(id);
        return project is null ? NotFound() : Ok(Mapper.ToDto(project));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var project = await service.CreateAsync(userId.Value, request.Name);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, Mapper.ToDto(project));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProjectRequest request)
    {
        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != id) return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, id)) return Forbid();
        }

        var project = await service.UpdateAsync(id, request.Name);
        return project is null ? NotFound() : Ok(Mapper.ToDto(project));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (HttpContext.Items["ApiProjectId"] is Guid apiId)
        {
            if (apiId != id) return Forbid();
        }
        else
        {
            var userId = User.GetUserId();
            if (userId is null) return Unauthorized();
            if (!await auth.CanAccessProjectAsync(userId.Value, id)) return Forbid();
        }

        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}