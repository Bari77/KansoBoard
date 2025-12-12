namespace Domain.Entities;

public class Column
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = default!;
    public int Order { get; set; }

    public Guid BoardId { get; set; }
    public Board Board { get; set; } = default!;

    public ICollection<Card> Cards { get; set; } = [];
}