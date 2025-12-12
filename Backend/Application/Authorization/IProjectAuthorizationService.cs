namespace Application.Authorization;

public interface IProjectAuthorizationService
{
    Task<bool> CanAccessProjectAsync(Guid userId, Guid projectId);
}
