namespace Application.Invitations;

public interface IInvitationService
{
    Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null);
    Task<bool> ConsumeAsync(string token, Guid userId);
}
