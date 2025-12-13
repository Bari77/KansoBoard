using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class KansoDbContext(DbContextOptions<KansoDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectUser> ProjectUsers => Set<ProjectUser>();
    public DbSet<Board> Boards => Set<Board>();
    public DbSet<Column> Columns => Set<Column>();
    public DbSet<Card> Cards => Set<Card>();
    public DbSet<Invitation> Invitations => Set<Invitation>();
    public DbSet<ProjectApiKey> ProjectApiKeys => Set<ProjectApiKey>();
    public DbSet<Webhook> Webhooks => Set<Webhook>();
    public DbSet<ProjectCounter> ProjectCounters => Set<ProjectCounter>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<ProjectUser>()
            .HasKey(pu => new { pu.UserId, pu.ProjectId });

        model.Entity<ProjectUser>()
            .HasOne(pu => pu.User)
            .WithMany(u => u.Projects)
            .HasForeignKey(pu => pu.UserId);

        model.Entity<ProjectUser>()
            .HasOne(pu => pu.Project)
            .WithMany(p => p.Users)
            .HasForeignKey(pu => pu.ProjectId);

        model.Entity<ProjectCounter>()
            .HasKey(pc => pc.ProjectId);

        model.Entity<ProjectCounter>()
            .Property(pc => pc.NextCardNumber)
            .IsRequired();
    }
}
