namespace Domain.Dtos;

public record ColumnDto(Guid Id, string Name, int Order, Guid BoardId);