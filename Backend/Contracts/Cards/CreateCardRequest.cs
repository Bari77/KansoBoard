namespace Contracts.Cards;

public record CreateCardRequest(Guid ColumnId, string Title, string? Description, CardType Type, CardPriority Priority);
