namespace KansoBoard.Contracts.Cards;

public record UpdateCardRequest(string Title, string? Description, CardType Type, CardPriority Priority);