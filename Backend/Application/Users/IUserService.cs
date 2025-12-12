using Domain.Entities;

namespace Application.Users;

public interface IUserService
{
    Task<User?> UpdateAsync(Guid id, string pseudo, string? avatarUrl);
    Task<bool> DeleteAsync(Guid id);
}
