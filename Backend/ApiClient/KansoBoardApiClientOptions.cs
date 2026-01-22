namespace KansoBoard.ApiClient;

public sealed class KansoBoardApiClientOptions
{
    public required string BaseUrl { get; set; }
    public string? ApiKey { get; set; }
}