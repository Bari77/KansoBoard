using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Boards;

public class BoardService(KansoDbContext db) : IBoardService
{
    public async Task<Board> CreateAsync(Guid projectId, string name)
    {
        var board = new Board
        {
            ProjectId = projectId,
            Name = name
        };

        db.Boards.Add(board);
        await db.SaveChangesAsync();

        return board;
    }

    public async Task<Board?> GetByIdAsync(Guid id)
    {
        return await db.Boards
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<List<Board>> GetByProjectAsync(Guid projectId)
    {
        return await db.Boards
            .AsNoTracking()
            .Where(b => b.ProjectId == projectId)
            .ToListAsync();
    }

    public async Task<Board?> UpdateAsync(Guid id, string name)
    {
        var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == id);
        if (board is null)
            return null;

        board.Name = name;
        await db.SaveChangesAsync();
        return board;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == id);
        if (board is null)
            return false;

        db.Boards.Remove(board);
        await db.SaveChangesAsync();
        return true;
    }
}
