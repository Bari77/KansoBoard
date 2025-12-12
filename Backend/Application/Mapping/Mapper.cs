using Domain.Dtos;
using Domain.Entities;

namespace Application.Mapping;

public static class Mapper
{
    public static ProjectDto ToDto(Project p)
        => new(p.Id, p.Name);

    public static BoardDto ToDto(Board b)
        => new(b.Id, b.Name, b.ProjectId);

    public static ColumnDto ToDto(Column c)
        => new(c.Id, c.Name, c.Order, c.BoardId);

    public static CardDto ToDto(Card c)
        => new(
            c.Id,
            c.Number,
            c.Title,
            c.Description,
            c.Type,
            c.Priority,
            c.ColumnId,
            c.AssignedToUserId
        );

    public static UserDto ToDto(User u)
        => new(u.Id, u.Email, u.Pseudo, u.AvatarUrl);
}
