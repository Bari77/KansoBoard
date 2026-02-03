using KansoBoard.Application.Webhooks;
using KansoBoard.Contracts.Cards;
using KansoBoard.Domain.Entities;
using KansoBoard.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace KansoBoard.Application.Cards;

public class CardService(KansoDbContext db, IWebhookService webhooks) : ICardService
{
    public async Task<Card> CreateAsync(
        Guid columnId,
        string title,
        string? description,
        CardType type,
        CardPriority priority)
    {
        await using var tx = await db.Database.BeginTransactionAsync();

        var column = await db.Columns
            .Include(c => c.Board)
                .ThenInclude(b => b.Project)
            .FirstAsync(c => c.Id == columnId);

        var project = column.Board.Project;

        var counter = await db.ProjectCounters.FirstAsync(c => c.ProjectId == project.Id);
        var number = counter.NextCardNumber;
        counter.NextCardNumber++;

        var card = new Card
        {
            Number = number,
            ColumnId = columnId,
            Title = title,
            Description = description,
            Type = type,
            Priority = priority
        };

        db.Cards.Add(card);

        await db.SaveChangesAsync();
        await tx.CommitAsync();

        await webhooks.TriggerAsync(
            project.Id,
            WebhookFormatter.StandardizedCardPayload(
                "card.created",
                project,
                column.Board,
                column,
                card));

        return card;
    }

    public async Task<Card?> GetByIdAsync(Guid id)
        => await db.Cards
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<List<Card>> GetByBoardAsync(Guid boardId)
        => await db.Cards
            .AsNoTracking()
            .Include(c => c.Column)
            .Where(c => c.Column.BoardId == boardId)
            .OrderBy(c => c.Order)
            .ToListAsync();

    public async Task<List<Card>> GetByUserIdAsync(Guid userId)
        => await db.Cards
            .AsNoTracking()
            .Include(c => c.Column)
            .Include(c => c.AssignedTo)
            .Where(c => c.AssignedToUserId == userId && !(c.Column.Locked && c.Column.Name == "Done"))
            .OrderByDescending(c => c.Priority)
            .ToListAsync();

    public async Task<Card?> UpdateAsync(Guid id, string title, string? description, CardType type, CardPriority priority)
    {
        var card = await db.Cards
            .Include(c => c.Column)
                .ThenInclude(col => col.Board)
                    .ThenInclude(b => b.Project)
            .Include(c => c.AssignedTo)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (card is null)
            return null;

        card.Title = title;
        card.Description = description;
        card.Type = type;
        card.Priority = priority;

        await db.SaveChangesAsync();

        var column = card.Column;
        var board = column.Board;
        var project = board.Project;

        await webhooks.TriggerAsync(project.Id, WebhookFormatter.StandardizedCardPayload("card.updated", project, board, column, card, card.AssignedTo));

        return card;
    }

    public async Task<bool> AssignAsync(Guid id, Guid? userId)
    {
        var card = await db.Cards
            .Include(c => c.Column)
                .ThenInclude(col => col.Board)
                    .ThenInclude(b => b.Project)
            .Include(c => c.AssignedTo)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (card is null)
            return false;

        var oldAssigned = card.AssignedTo;

        card.AssignedToUserId = userId;
        await db.SaveChangesAsync();

        var column = card.Column;
        var board = column.Board;
        var project = board.Project;

        var newAssigned = card.AssignedTo;

        var hookType = userId is null ? "card.unassigned" : "card.assigned";

        await webhooks.TriggerAsync(project.Id, WebhookFormatter.StandardizedCardPayload(hookType, project, board, column, card, newAssigned));

        return true;
    }

    public async Task<bool> MoveAsync(Guid id, Guid newColumnId)
    {
        var card = await db.Cards
            .Include(c => c.Column)
                .ThenInclude(col => col.Board)
                    .ThenInclude(b => b.Project)
            .Include(c => c.AssignedTo)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (card is null)
            return false;

        var oldColumn = card.Column;
        var oldBoard = oldColumn.Board;

        var newColumn = await db.Columns
            .Include(c => c.Board)
                .ThenInclude(b => b.Project)
            .FirstAsync(c => c.Id == newColumnId);

        if (newColumn.Board.Id != oldBoard.Id)
            return false;

        card.ColumnId = newColumnId;
        await db.SaveChangesAsync();

        await webhooks.TriggerAsync(newColumn.Board.ProjectId, WebhookFormatter.StandardizedCardPayload("card.moved", newColumn.Board.Project, newColumn.Board, newColumn, card, card.AssignedTo));

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var card = await db.Cards
            .Include(c => c.Column)
                .ThenInclude(col => col.Board)
                    .ThenInclude(b => b.Project)
            .Include(c => c.AssignedTo)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (card is null)
            return false;

        var column = card.Column;
        var board = column.Board;
        var project = board.Project;
        var assigned = card.AssignedTo;
        var columnId = card.ColumnId;

        db.Cards.Remove(card);
        await db.SaveChangesAsync();

        var siblings = await db.Cards
            .Where(c => c.ColumnId == columnId)
            .OrderBy(c => c.Order)
            .ToListAsync();

        for (int i = 0; i < siblings.Count; i++)
            siblings[i].Order = i + 1;

        await db.SaveChangesAsync();

        await webhooks.TriggerAsync(
            project.Id,
            WebhookFormatter.StandardizedCardPayload(
                "card.deleted",
                project,
                board,
                column,
                card,
                assigned
            )
        );

        return true;
    }

    public async Task<bool> ReorderAsync(Guid id, List<CardOrderDto> orders)
    {
        var cards = await db.Cards
            .Where(c => c.ColumnId == id)
            .ToListAsync();

        foreach (var card in cards)
        {
            var dto = orders.First(o => o.Id == card.Id);
            card.Order = dto.Order;
        }

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> TransferAsync(Guid id, Guid boardId)
    {
        var card = await db.Cards
        .Include(c => c.Column)
        .FirstOrDefaultAsync(c => c.Id == id);

        if (card is null)
            return false;

        var sourceColumnId = card.ColumnId;
        var sourceBoardId = card.Column.BoardId;

        var targetNewColumn = await db.Columns
            .Where(c => c.BoardId == boardId && c.Locked && c.Name == "New")
            .SingleOrDefaultAsync();

        if (targetNewColumn is null)
            return false;

        var maxOrderInTarget = await db.Cards
            .Where(c => c.ColumnId == targetNewColumn.Id)
            .MaxAsync(c => (int?)c.Order) ?? 0;

        await db.Cards
            .Where(c => c.ColumnId == sourceColumnId && c.Order > card.Order)
            .ExecuteUpdateAsync(c =>
                c.SetProperty(x => x.Order, x => x.Order - 1)
            );

        card.ColumnId = targetNewColumn.Id;
        card.Order = maxOrderInTarget + 1;

        await db.SaveChangesAsync();

        return true;
    }
}
