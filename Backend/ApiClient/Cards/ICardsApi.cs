using Contracts.Cards;

namespace ApiClient.Cards;

public interface ICardsApi
{
    Task<IReadOnlyList<CardDto>> GetByBoardAsync(Guid boardId);
    Task<CardDto?> GetByIdAsync(Guid id);

    Task<CardDto> CreateAsync(CreateCardRequest request);
    Task<CardDto?> UpdateAsync(Guid id, UpdateCardRequest request);

    Task<bool> DeleteAsync(Guid id);

    Task<bool> AssignAsync(Guid cardId, Guid userId);
    Task<bool> MoveAsync(Guid cardId, Guid newColumnId);
    Task<bool> ReorderAsync(Guid columnId, IReadOnlyList<CardOrderDto> orders);
}
