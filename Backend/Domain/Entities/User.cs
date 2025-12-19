namespace KansoBoard.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = default!;
    public string Pseudo { get; set; } = default!;
    public string? AvatarUrl { get; set; }

    public string PasswordHash { get; set; } = default!;
    public string PasswordSalt { get; set; } = default!;

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    public ICollection<ProjectUser> Projects { get; set; } = [];
}
