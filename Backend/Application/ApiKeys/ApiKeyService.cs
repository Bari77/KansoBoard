using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Application.ApiKeys;

public class ApiKeyService(KansoDbContext db) : IApiKeyService
{
    public async Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null)
    {
        const string prefix = "kanso_";
        const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        const int length = 15;

        var buffer = RandomNumberGenerator.GetBytes(length);
        var keyBody = new char[length];

        for (var i = 0; i < length; i++)
        {
            keyBody[i] = chars[buffer[i] % chars.Length];
        }

        var key = prefix + new string(keyBody);

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

    public async Task<bool> RevokeAsync(string key)
    {
        var apiKey = await db.ProjectApiKeys.FirstOrDefaultAsync(k => k.Key == key);
        if (apiKey is null) return false;

        apiKey.Revoked = true;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<ProjectApiKey?> GetAsync(Guid projectId)
    {
        return await db.ProjectApiKeys
            .AsNoTracking()
            .Where(k => k.ProjectId == projectId && !k.Revoked)
            .FirstOrDefaultAsync();
    }

    public async Task<Guid?> ValidateAsync(string key)
    {
        var apiKey = await db.ProjectApiKeys.FirstOrDefaultAsync(k =>
            k.Key == key &&
            !k.Revoked &&
            (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));

        return apiKey?.ProjectId;
    }
}
