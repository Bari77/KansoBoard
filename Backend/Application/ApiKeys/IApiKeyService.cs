using Domain.Entities;

namespace Application.ApiKeys;

public interface IApiKeyService
{
    Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null);
    Task<Guid?> ValidateAsync(string key);
    Task<bool> RevokeAsync(string key);
    Task<List<ProjectApiKey>> ListAsync(Guid projectId);
}
