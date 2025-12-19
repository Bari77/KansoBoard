using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Auth;

public interface IAuthService
{
    Task<User> RegisterAsync(string email, string pseudo, string password);
    Task<string?> LoginAsync(string email, string password);
    Task<string?> RefreshAsync(string refreshToken);
    Task<User?> GetUserFromTokenAsync(string token);
}
