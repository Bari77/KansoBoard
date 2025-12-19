namespace KansoBoard.Application.Authorization;

public interface IProjectContextResolver
{
    Task<Guid?> GetProjectIdFromBoard(Guid boardId);
    Task<Guid?> GetProjectIdFromColumn(Guid columnId);
    Task<Guid?> GetProjectIdFromCard(Guid cardId);
}
