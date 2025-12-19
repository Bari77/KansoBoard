using KansoBoard.Contracts.Columns;
using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Columns;

public interface IColumnService
{
    Task<Column> CreateAsync(Guid boardId, string name);
    Task<List<Column>> GetByBoardAsync(Guid boardId);
    Task<Column?> GetByIdAsync(Guid id);
    Task<Column?> UpdateAsync(Guid id, string name);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ReorderAsync(Guid id, List<ColumnOrderDto> orders);
}