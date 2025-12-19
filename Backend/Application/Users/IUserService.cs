using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Users;

public interface IUserService
{
    Task<User?> UpdateAsync(Guid id, string pseudo, string? avatarUrl);
    Task<bool> DeleteAsync(Guid id);
}
