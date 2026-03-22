namespace KansoBoard.Contracts.Projects;

public record UpdateProjectRequest(
    string Name,
    IReadOnlyList<ProjectCustomFieldRequest>? CustomFields
);