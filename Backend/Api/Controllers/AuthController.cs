using KansoBoard.Application.Auth;
using KansoBoard.Application.Mapping;
using KansoBoard.Contracts.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService service) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        var user = await service.RegisterAsync(req.Email, req.Pseudo, req.Password);
        return Ok(user.Id);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var token = await service.LoginAsync(req.Email, req.Password);
        return token is null ? BadRequest() : Ok(token);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest req)
    {
        var token = await service.RefreshAsync(req.RefreshToken);
        return token is null ? Unauthorized() : Ok(token);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        if (authHeader is null) return Unauthorized();

        var token = authHeader.Replace("Bearer ", "");
        var user = await service.GetUserFromTokenAsync(token);

        return user is null ? Unauthorized() : Ok(Mapper.ToDto(user));
    }
}
