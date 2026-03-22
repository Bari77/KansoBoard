namespace KansoBoard.Contracts.Cards;

public record CardCustomFieldValueRequest(
    Guid FieldId,
    string? TextValue,
    decimal? NumberValue
);
