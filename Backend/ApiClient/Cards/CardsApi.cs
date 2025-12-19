using KansoBoard.Contracts.Cards;
using System.Net;
using System.Net.Http.Json;

namespace KansoBoard.ApiClient.Cards;

internal sealed class CardsApi(HttpClient http) : ICardsApi
{
    public async Task<IReadOnlyList<CardDto>> GetByBoardAsync(Guid boardId)
        => await http.GetFromJsonAsync<List<CardDto>>(
            $"api/cards/board/{boardId}"
        ) ?? [];

    public async Task<CardDto?> GetByIdAsync(Guid id)
        => await http.GetFromJsonAsync<CardDto>($"api/cards/{id}");

    public async Task<CardDto> CreateAsync(CreateCardRequest request)
    {
        var res = await http.PostAsJsonAsync("api/cards", request);
        res.EnsureSuccessStatusCode();
        return (await res.Content.ReadFromJsonAsync<CardDto>())!;
    }

    public async Task<CardDto?> UpdateAsync(Guid id, UpdateCardRequest request)
    {
        var res = await http.PutAsJsonAsync($"api/cards/{id}", request);

        if (res.StatusCode == HttpStatusCode.NotFound)
            return null;

        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<CardDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var res = await http.DeleteAsync($"api/cards/{id}");

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }

    public async Task<bool> AssignAsync(Guid cardId, Guid userId)
    {
        var res = await http.PostAsJsonAsync(
            $"api/cards/{cardId}/assign",
            new AssignUserRequest(userId)
        );

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }

    public async Task<bool> MoveAsync(Guid cardId, Guid newColumnId)
    {
        var res = await http.PostAsJsonAsync(
            $"api/cards/{cardId}/move",
            new MoveCardRequest(newColumnId)
        );

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }

    public async Task<bool> ReorderAsync(
        Guid columnId,
        IReadOnlyList<CardOrderDto> orders)
    {
        var res = await http.PostAsJsonAsync(
            $"api/cards/{columnId}/reorder",
            orders
        );

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }
}

