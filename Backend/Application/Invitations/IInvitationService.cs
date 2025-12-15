namespace Application.Invitations;

public interface IInvitationService
{
    Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null);
    Task<ConsumeInvitationResult?> ConsumeAsync(string token, Guid userId);
}

public record ConsumeInvitationResult(Guid ProjectId, bool AlreadyMember);