namespace KansoBoard.Contracts.Projects;

public record ProjectDto(
    Guid Id,
    string Name,
    IReadOnlyList<ProjectCustomFieldDto> CustomFields
);
