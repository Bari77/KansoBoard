namespace KansoBoard.ApiClient;

public sealed class KansoBoardApiClientOptions
{
    public required string BaseUrl { get; init; }
    public string? ApiKey { get; init; }
}