using Application.ProjectUsers;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Projects;

public class ProjectService(KansoDbContext db, IProjectUserService projectUsers) : IProjectService
{
    public async Task<Project> CreateAsync(Guid userId, string name)
    {
        var project = new Project
        {
            Name = name
        };

        db.Projects.Add(project);

        db.ProjectCounters.Add(new ProjectCounter
        {
            ProjectId = project.Id,
            NextCardNumber = 1
        });

        await db.SaveChangesAsync();

        await projectUsers.AddUserAsync(project.Id, userId);

        return project;
    }

    public async Task<Project?> GetByIdAsync(Guid id)
    {
        return await db.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Project>> GetAllAsync(Guid idUser)
    {
        return await db.ProjectUsers
            .Where(pu => pu.UserId == idUser)
            .Select(pu => pu.Project)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Board>> GetBoardsAsync(Guid projectId)
    {
        return await db.Boards
            .Where(b => b.ProjectId == projectId)
            .OrderBy(b => b.Name)
            .ToListAsync();
    }

    public async Task<Project?> UpdateAsync(Guid id, string name)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id);
        if (project == null)
            return null;

        project.Name = name;
        await db.SaveChangesAsync();
        return project;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id);
        if (project == null)
            return false;

        db.Projects.Remove(project);
        await db.SaveChangesAsync();
        return true;
    }
}
