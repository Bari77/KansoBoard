using KansoBoard.Api.Extensions;
using KansoBoard.Application.Mapping;
using KansoBoard.Application.Users;
using KansoBoard.Contracts.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService service) : ControllerBase
{
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(UpdateUserRequest req)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var user = await service.UpdateAsync(userId.Value, req.Pseudo, req.AvatarUrl);
        return user is null ? NotFound() : Ok(Mapper.ToDto(user));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateUserRequest req)
    {
        var user = await service.UpdateAsync(id, req.Pseudo, req.AvatarUrl);
        return user is null ? NotFound() : Ok(Mapper.ToDto(user));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        return await service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}