namespace KansoBoard.Contracts.Columns;

public record ColumnDto(Guid Id, string Name, int Order, bool Locked, Guid BoardId);