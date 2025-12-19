using KansoBoard.ApiClient.Boards;
using KansoBoard.ApiClient.Cards;
using KansoBoard.ApiClient.Columns;

namespace KansoBoard.ApiClient;

public sealed class KansoBoardApiClient(HttpClient http) : IKansoBoardApiClient
{
    public IBoardsApi Boards { get; } = new BoardsApi(http);
    public IColumnsApi Columns { get; } = new ColumnsApi(http);
    public ICardsApi Cards { get; } = new CardsApi(http);
}
