namespace Contracts.Columns;

public record ColumnDto(Guid Id, string Name, int Order, Guid BoardId);