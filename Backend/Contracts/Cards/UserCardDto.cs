namespace KansoBoard.Contracts.Cards;

public record UserCardDto(
    Guid Id,
    uint Number,
    string Title,
    int Order,
    string? Description,
    CardType Type,
    CardPriority Priority,
    Guid ColumnId,
    Guid? AssignedToUserId,
    Guid BoardId
);
