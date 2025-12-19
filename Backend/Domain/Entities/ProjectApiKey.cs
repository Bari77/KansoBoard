namespace KansoBoard.Domain.Entities;

public class ProjectApiKey
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public string Key { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool Revoked { get; set; }
}
