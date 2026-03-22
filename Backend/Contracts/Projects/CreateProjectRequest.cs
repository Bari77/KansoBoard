namespace KansoBoard.Contracts.Projects;

public record CreateProjectRequest(
    string Name,
    IReadOnlyList<ProjectCustomFieldRequest>? CustomFields
);