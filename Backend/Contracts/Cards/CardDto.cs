namespace Contracts.Cards;

public record CardDto(
    Guid Id,
    uint Number,
    string Title,
    int Order,
    string? Description,
    CardType Type,
    CardPriority Priority,
    Guid ColumnId,
    Guid? AssignedToUserId
);