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
        var result = await service.LoginAsync(req.Email, req.Password);
        if (result is null) return BadRequest();
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest req)
    {
        var result = await service.RefreshAsync(req.RefreshToken);
        if (result is null) return Unauthorized();
        return Ok(result);
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

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        if (authHeader is null) return Unauthorized();

        var token = authHeader.Replace("Bearer ", "");
        var user = await service.GetUserFromTokenAsync(token);

        if (user is null) return Unauthorized();

        var result = await service.LogoutAsync(user.Id);
        return result ? Ok() : BadRequest();
    }
}
