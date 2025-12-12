using Application.ProjectUsers;

namespace Application.Authorization;

public class ProjectAuthorizationService(IProjectUserService projectUsers) : IProjectAuthorizationService
{
    public async Task<bool> CanAccessProjectAsync(Guid userId, Guid projectId)
        => await projectUsers.IsMemberAsync(projectId, userId);
}
