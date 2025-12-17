using ApiClient.Boards;
using ApiClient.Cards;
using ApiClient.Columns;

namespace ApiClient;

public interface IKansoBoardApiClient
{
    IBoardsApi Boards { get; }
    IColumnsApi Columns { get; }
    ICardsApi Cards { get; }
}