namespace KansoBoard.Contracts.Projects;

public record ProjectCustomFieldRequest(
    Guid? Id,
    string Label,
    ProjectCustomFieldType Type,
    bool AllowCustomValues,
    List<string>? Options
);
