using Domain.Enums;

namespace Domain.Entities;

public class Card
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public uint Number { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }

    public CardType Type { get; set; }
    public CardPriority Priority { get; set; }

    public Guid? AssignedToUserId { get; set; }
    public User? AssignedTo { get; set; }

    public Guid ColumnId { get; set; }
    public Column Column { get; set; } = default!;
}