using KansoBoard.Domain.Entities;
using KansoBoard.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace KansoBoard.Application.Auth;

public class AuthService(KansoDbContext db, IConfiguration config) : IAuthService
{
    public async Task<User> RegisterAsync(string email, string pseudo, string password)
    {
        var exists = await db.Users.AnyAsync(u => u.Email == email);
        if (exists) throw new Exception("Email already exists");

        var salt = GenerateSalt();
        var hash = HashPassword(password, salt);

        var user = new User
        {
            Email = email,
            Pseudo = pseudo,
            PasswordSalt = salt,
            PasswordHash = hash,
            RefreshToken = GenerateRefreshToken(),
            RefreshTokenExpiry = DateTime.UtcNow.AddDays(7)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return user;
    }

    public async Task<string?> LoginAsync(string email, string password)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null) return null;

        var hash = HashPassword(password, user.PasswordSalt);
        if (hash != user.PasswordHash) return null;

        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await db.SaveChangesAsync();

        return GenerateJwt(user);
    }

    public async Task<string?> RefreshAsync(string refreshToken)
    {
        var user = await db.Users.FirstOrDefaultAsync(u =>
            u.RefreshToken == refreshToken &&
            u.RefreshTokenExpiry > DateTime.UtcNow);

        if (user is null) return null;

        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
        await db.SaveChangesAsync();

        return GenerateJwt(user);
    }

    public async Task<User?> GetUserFromTokenAsync(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        var userIdClaim = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return null;

        return await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    private string GenerateSalt()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    private string HashPassword(string password, string salt)
    {
        var key = Encoding.UTF8.GetBytes(salt);
        using var hmac = new HMACSHA512(key);
        var bytes = Encoding.UTF8.GetBytes(password);
        return Convert.ToBase64String(hmac.ComputeHash(bytes));
    }

    private string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims:
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("pseudo", user.Pseudo)
            ],
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
