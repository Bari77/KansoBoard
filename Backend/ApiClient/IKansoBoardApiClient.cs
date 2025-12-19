using KansoBoard.ApiClient.Boards;
using KansoBoard.ApiClient.Cards;
using KansoBoard.ApiClient.Columns;

namespace KansoBoard.ApiClient;

public interface IKansoBoardApiClient
{
    IBoardsApi Boards { get; }
    IColumnsApi Columns { get; }
    ICardsApi Cards { get; }
}