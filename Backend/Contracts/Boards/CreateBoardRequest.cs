namespace Contracts.Boards;

public record CreateBoardRequest(Guid ProjectId, string Name);