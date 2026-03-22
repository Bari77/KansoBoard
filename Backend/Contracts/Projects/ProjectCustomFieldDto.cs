namespace KansoBoard.Contracts.Projects;

public record ProjectCustomFieldDto(
    Guid Id,
    string Label,
    ProjectCustomFieldType Type,
    bool AllowCustomValues,
    List<string> Options
);
