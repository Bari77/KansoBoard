namespace Domain.Dtos;

public record UserDto(Guid Id, string Email, string Pseudo, string? AvatarUrl);