namespace KansoBoard.Contracts.Cards;

public record CardCustomFieldValueDto(
    Guid FieldId,
    string? TextValue,
    decimal? NumberValue
);
