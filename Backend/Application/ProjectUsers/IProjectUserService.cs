using Domain.Entities;

namespace Application.ProjectUsers;

public interface IProjectUserService
{
    Task<bool> AddUserAsync(Guid projectId, Guid userId);
    Task<bool> RemoveUserAsync(Guid projectId, Guid userId);
    Task<bool> IsMemberAsync(Guid projectId, Guid userId);
    Task<List<User>> GetUsersAsync(Guid projectId);
}
