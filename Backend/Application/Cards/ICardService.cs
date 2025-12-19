using KansoBoard.Contracts.Cards;
using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Cards;

public interface ICardService
{
    Task<Card> CreateAsync(Guid columnId, string title, string? description, CardType type, CardPriority priority);
    Task<Card?> GetByIdAsync(Guid id);
    Task<List<Card>> GetByBoardAsync(Guid boardId);
    Task<Card?> UpdateAsync(Guid id, string title, string? description, CardType type, CardPriority priority);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> AssignAsync(Guid id, Guid? userId);
    Task<bool> MoveAsync(Guid id, Guid newColumnId);
    Task<bool> ReorderAsync(Guid id, List<CardOrderDto> orders);
}