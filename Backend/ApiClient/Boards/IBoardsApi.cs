using KansoBoard.Contracts.Boards;

namespace KansoBoard.ApiClient.Boards
{
    public interface IBoardsApi
    {
        Task<BoardDto?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<BoardDto>> GetByProjectAsync(Guid projectId);
        Task<BoardDto> CreateAsync(CreateBoardRequest request);
        Task<BoardDto?> UpdateAsync(Guid id, UpdateBoardRequest request);
        Task<bool> DeleteAsync(Guid id);
    }
}
