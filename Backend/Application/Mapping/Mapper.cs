using KansoBoard.Contracts.ApiKeys;
using KansoBoard.Contracts.Boards;
using KansoBoard.Contracts.Cards;
using KansoBoard.Contracts.Columns;
using KansoBoard.Contracts.Projects;
using KansoBoard.Contracts.Users;
using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Mapping;

public static class Mapper
{
    public static ProjectDto ToDto(Project p)
        => new(p.Id, p.Name);

    public static ProjectApiKeyDto ToDto(ProjectApiKey p)
        => new(p.Id, p.ProjectId, p.Key, p.CreatedAt, p.ExpiresAt, p.Revoked);

    public static BoardDto ToDto(Board b)
        => new(b.Id, b.Name, b.ProjectId);

    public static ColumnDto ToDto(Column c)
        => new(c.Id, c.Name, c.Order, c.Locked, c.BoardId);

    public static CardDto ToDto(Card c)
        => new(
            c.Id,
            c.Number,
            c.Title,
            c.Order,
            c.Description,
            c.Type,
            c.Priority,
            c.ColumnId,
            c.AssignedToUserId
        );

    public static UserDto ToDto(User u)
        => new(u.Id, u.Email, u.Pseudo, u.AvatarUrl);
}
