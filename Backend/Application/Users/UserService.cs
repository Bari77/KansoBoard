using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Users;

public class UserService(KansoDbContext db) : IUserService
{
    public async Task<User?> UpdateAsync(Guid id, string pseudo, string? avatarUrl)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
            return null;

        user.Pseudo = pseudo;
        user.AvatarUrl = avatarUrl;

        await db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
            return false;

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return true;
    }
}
