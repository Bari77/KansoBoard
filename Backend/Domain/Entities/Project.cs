namespace Domain.Entities;

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = default!;

    public ICollection<ProjectUser> Users { get; set; } = [];
    public ICollection<Board> Boards { get; set; } = [];
}