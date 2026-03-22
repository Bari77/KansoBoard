using KansoBoard.Contracts.Projects;
using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Projects;

public interface IProjectService
{
    Task<Project> CreateAsync(Guid userId, string name, IReadOnlyList<ProjectCustomFieldRequest>? customFields);
    Task<Project?> GetByIdAsync(Guid id);
    Task<List<Project>> GetAllAsync(Guid idUser);
    Task<List<Board>> GetBoardsAsync(Guid id);
    Task<Project?> UpdateAsync(Guid id, string name, IReadOnlyList<ProjectCustomFieldRequest>? customFields);
    Task<bool> DeleteAsync(Guid id);
}
