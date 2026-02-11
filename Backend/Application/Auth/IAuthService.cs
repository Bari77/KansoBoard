using KansoBoard.Contracts.Auth;
using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Auth;

public interface IAuthService
{
    Task<User> RegisterAsync(string email, string pseudo, string password);
    Task<LoginResponse?> LoginAsync(string email, string password);
    Task<RefreshResponse?> RefreshAsync(string refreshToken);
    Task<User?> GetUserFromTokenAsync(string token);
    Task<bool> LogoutAsync(Guid userId);
}
