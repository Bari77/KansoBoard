namespace Domain.Entities;

public class ProjectUser
{
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
}