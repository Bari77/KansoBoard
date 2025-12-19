namespace KansoBoard.Contracts.Auth;

public record RegisterRequest(string Email, string Pseudo, string Password);
