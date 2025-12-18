namespace Contracts.ApiKeys
{
    public record ProjectApiKeyDto(Guid Id, Guid ProjectId, string Key, DateTime CreatedAt, DateTime? ExpiresAt, bool Revoked);
}
