using System.Text.Json.Serialization;

namespace KansoBoard.Api.Models;

public class ErrorResponse
{
    [JsonPropertyName("Message")]
    public required string Message { get; init; }
}
