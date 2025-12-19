namespace KansoBoard.Domain.Entities;

public class Webhook
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public string Url { get; set; } = default!;
    public bool Active { get; set; } = true;
}
