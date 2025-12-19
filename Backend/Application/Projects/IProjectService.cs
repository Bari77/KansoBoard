using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Projects;

public interface IProjectService
{
    Task<Project> CreateAsync(Guid userId, string name);
    Task<Project?> GetByIdAsync(Guid id);
    Task<List<Project>> GetAllAsync(Guid idUser);
    Task<List<Board>> GetBoardsAsync(Guid id);
    Task<Project?> UpdateAsync(Guid id, string name);
    Task<bool> DeleteAsync(Guid id);
}
