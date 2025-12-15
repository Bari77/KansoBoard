using Application.ProjectUsers;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Invitations;

public class InvitationService(KansoDbContext db, IProjectUserService projectUsers) : IInvitationService
{
    private static readonly Random Random = new();

    public async Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null)
    {
        var now = DateTime.UtcNow;
        var duration = lifetime ?? TimeSpan.FromDays(7);

        var existing = await db.Invitations
            .Where(i =>
                i.ProjectId == projectId &&
                i.ExpiresAt > now)
            .OrderByDescending(i => i.ExpiresAt)
            .FirstOrDefaultAsync();

        if (existing is not null)
        {
            existing.ExpiresAt = now.Add(duration);
            await db.SaveChangesAsync();
            return existing.Token;
        }

        var token = RandomString(10);

        var invitation = new Invitation
        {
            ProjectId = projectId,
            Token = token,
            ExpiresAt = now.Add(duration),
        };

        db.Invitations.Add(invitation);
        await db.SaveChangesAsync();

        return token;
    }

    public async Task<ConsumeInvitationResult?> ConsumeAsync(string token, Guid userId)
    {
        var inv = await db.Invitations.FirstOrDefaultAsync(i =>
            i.Token == token &&
            i.ExpiresAt > DateTime.UtcNow) ?? throw new Exception("ERR_INVITATION_NOT_FOUND");

        if (await db.ProjectUsers.AnyAsync(f => f.UserId == userId && f.ProjectId == inv.ProjectId))
        {
            return new ConsumeInvitationResult(inv.ProjectId, true);
        }

        await projectUsers.AddUserAsync(inv.ProjectId, userId);
        await db.SaveChangesAsync();

        return new ConsumeInvitationResult(inv.ProjectId, false);
    }

    private static string RandomString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[Random.Next(s.Length)]).ToArray());
    }
}
