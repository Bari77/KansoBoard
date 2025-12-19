using KansoBoard.Contracts.Columns;

namespace KansoBoard.ApiClient.Columns
{
    public interface IColumnsApi
    {
        Task<IReadOnlyList<ColumnDto>> GetByBoardAsync(Guid boardId);
        Task<ColumnDto?> GetByIdAsync(Guid id);

        Task<ColumnDto> CreateAsync(CreateColumnRequest request);
        Task<ColumnDto?> UpdateAsync(Guid id, UpdateColumnRequest request);

        Task<bool> DeleteAsync(Guid id);
        Task<bool> ReorderAsync(Guid boardId, IReadOnlyList<ColumnOrderDto> orders);
    }
}
