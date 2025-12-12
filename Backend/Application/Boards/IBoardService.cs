using Domain.Entities;

namespace Application.Boards;

public interface IBoardService
{
    Task<Board> CreateAsync(Guid projectId, string name);
    Task<Board?> GetByIdAsync(Guid id);
    Task<List<Board>> GetByProjectAsync(Guid projectId);
    Task<Board?> UpdateAsync(Guid id, string name);
    Task<bool> DeleteAsync(Guid id);
}