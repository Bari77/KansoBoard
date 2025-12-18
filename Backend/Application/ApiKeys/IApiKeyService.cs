using Domain.Entities;

namespace Application.ApiKeys;

public interface IApiKeyService
{
    Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null);
    Task<bool> RevokeAsync(string key);
    Task<ProjectApiKey?> GetAsync(Guid projectId);
    Task<Guid?> ValidateAsync(string key);
}
