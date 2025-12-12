using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.ProjectUsers;

public class ProjectUserService(KansoDbContext db) : IProjectUserService
{
    public async Task<bool> AddUserAsync(Guid projectId, Guid userId)
    {
        var exists = await db.ProjectUsers.AnyAsync(pu =>
            pu.ProjectId == projectId && pu.UserId == userId);

        if (exists)
            return true;

        db.ProjectUsers.Add(new ProjectUser
        {
            ProjectId = projectId,
            UserId = userId
        });

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveUserAsync(Guid projectId, Guid userId)
    {
        var entry = await db.ProjectUsers.FirstOrDefaultAsync(pu =>
            pu.ProjectId == projectId && pu.UserId == userId);

        if (entry is null)
            return false;

        db.ProjectUsers.Remove(entry);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsMemberAsync(Guid projectId, Guid userId)
        => await db.ProjectUsers.AnyAsync(pu =>
            pu.ProjectId == projectId && pu.UserId == userId);

    public async Task<List<User>> GetUsersAsync(Guid projectId)
        => await db.ProjectUsers
            .Where(pu => pu.ProjectId == projectId)
            .Select(pu => pu.User)
            .ToListAsync();
}
