using Contracts.Columns;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Columns;

public class ColumnService(KansoDbContext db) : IColumnService
{
    public async Task<Column> CreateAsync(Guid boardId, string name)
    {
        var maxOrder = await db.Columns
            .Where(c => c.BoardId == boardId)
            .MaxAsync(c => (int?)c.Order) ?? 0;

        var column = new Column
        {
            BoardId = boardId,
            Name = name,
            Order = maxOrder + 1
        };

        db.Columns.Add(column);
        await db.SaveChangesAsync();
        return column;
    }

    public async Task<List<Column>> GetByBoardAsync(Guid boardId)
        => await db.Columns
            .AsNoTracking()
            .Where(c => c.BoardId == boardId)
            .OrderBy(c => c.Order)
            .ToListAsync();

    public async Task<Column?> GetByIdAsync(Guid id)
        => await db.Columns
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<Column?> UpdateAsync(Guid id, string name)
    {
        var col = await db.Columns.FirstOrDefaultAsync(c => c.Id == id);
        if (col is null)
            return null;

        col.Name = name;
        await db.SaveChangesAsync();
        return col;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var col = await db.Columns.FirstOrDefaultAsync(c => c.Id == id);
        if (col is null)
            return false;

        db.Columns.Remove(col);
        await db.SaveChangesAsync();

        var siblings = await db.Columns
            .Where(c => c.BoardId == col.BoardId)
            .OrderBy(c => c.Order)
            .ToListAsync();

        for (int i = 0; i < siblings.Count; i++)
            siblings[i].Order = i + 1;

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(Guid id, List<ColumnOrderDto> orders)
    {
        var columns = await db.Columns
            .Where(c => c.BoardId == id)
            .ToListAsync();

        foreach (var col in columns)
        {
            var dto = orders.First(o => o.Id == col.Id);
            col.Order = dto.Order;
        }

        await db.SaveChangesAsync();
        return true;
    }
}
