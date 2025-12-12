using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Application.ApiKeys;

public class ApiKeyService(KansoDbContext db) : IApiKeyService
{
    public async Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null)
    {
        var key = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48))
            .Replace("=", "").Replace("/", "").Replace("+", "");

        var apiKey = new ProjectApiKey
        {
            ProjectId = projectId,
            Key = key,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = lifetime is null ? null : DateTime.UtcNow.Add(lifetime.Value),
            Revoked = false
        };

        db.ProjectApiKeys.Add(apiKey);
        await db.SaveChangesAsync();
        return key;
    }

    public async Task<Guid?> ValidateAsync(string key)
    {
        var apiKey = await db.ProjectApiKeys.FirstOrDefaultAsync(k =>
            k.Key == key &&
            !k.Revoked &&
            (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));

        return apiKey?.ProjectId;
    }

    public async Task<bool> RevokeAsync(string key)
    {
        var apiKey = await db.ProjectApiKeys.FirstOrDefaultAsync(k => k.Key == key);
        if (apiKey is null) return false;

        apiKey.Revoked = true;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProjectApiKey>> ListAsync(Guid projectId)
    {
        return await db.ProjectApiKeys
            .AsNoTracking()
            .Where(k => k.ProjectId == projectId)
            .ToListAsync();
    }
}
