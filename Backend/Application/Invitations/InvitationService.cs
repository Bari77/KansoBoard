using Application.ProjectUsers;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Application.Invitations;

public class InvitationService(KansoDbContext db, IProjectUserService projectUsers) : IInvitationService
{
    public async Task<string> CreateAsync(Guid projectId, TimeSpan? lifetime = null)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48))
            .Replace("=", "").Replace("/", "").Replace("+", "");

        var inv = new Invitation
        {
            ProjectId = projectId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.Add(lifetime ?? TimeSpan.FromDays(7)),
            Used = false
        };

        db.Invitations.Add(inv);
        await db.SaveChangesAsync();
        return token;
    }

    public async Task<bool> ConsumeAsync(string token, Guid userId)
    {
        var inv = await db.Invitations.FirstOrDefaultAsync(i =>
            i.Token == token &&
            !i.Used &&
            i.ExpiresAt > DateTime.UtcNow);

        if (inv is null)
            return false;

        await projectUsers.AddUserAsync(inv.ProjectId, userId);

        inv.Used = true;
        await db.SaveChangesAsync();

        return true;
    }
}
