using Domain.Enums;

namespace Domain.Dtos;

public record CardDto(
    Guid Id,
    uint Number,
    string Title,
    string? Description,
    CardType Type,
    CardPriority Priority,
    Guid ColumnId,
    Guid? AssignedToUserId
);