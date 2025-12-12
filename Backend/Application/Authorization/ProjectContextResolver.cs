using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Authorization;

public class ProjectContextResolver(KansoDbContext db) : IProjectContextResolver
{
    public async Task<Guid?> GetProjectIdFromBoard(Guid boardId)
        => await db.Boards.Where(b => b.Id == boardId).Select(b => (Guid?)b.ProjectId).FirstOrDefaultAsync();

    public async Task<Guid?> GetProjectIdFromColumn(Guid columnId)
        => await db.Columns.Where(c => c.Id == columnId).Select(c => (Guid?)c.Board.ProjectId).FirstOrDefaultAsync();

    public async Task<Guid?> GetProjectIdFromCard(Guid cardId)
        => await db.Cards.Where(c => c.Id == cardId).Select(c => (Guid?)c.Column.Board.ProjectId).FirstOrDefaultAsync();
}
