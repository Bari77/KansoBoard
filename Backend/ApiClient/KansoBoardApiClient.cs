using ApiClient.Boards;
using ApiClient.Cards;
using ApiClient.Columns;

namespace ApiClient;

public sealed class KansoBoardApiClient(HttpClient http) : IKansoBoardApiClient
{
    public IBoardsApi Boards { get; } = new BoardsApi(http);
    public IColumnsApi Columns { get; } = new ColumnsApi(http);
    public ICardsApi Cards { get; } = new CardsApi(http);
}
