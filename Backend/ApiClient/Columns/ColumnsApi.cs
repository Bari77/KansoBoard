using KansoBoard.Contracts.Columns;
using System.Net;
using System.Net.Http.Json;

namespace KansoBoard.ApiClient.Columns;

internal sealed class ColumnsApi(HttpClient http) : IColumnsApi
{
    public async Task<IReadOnlyList<ColumnDto>> GetByBoardAsync(Guid boardId)
        => await http.GetFromJsonAsync<List<ColumnDto>>(
            $"api/columns/board/{boardId}"
        ) ?? [];

    public async Task<ColumnDto?> GetByIdAsync(Guid id)
        => await http.GetFromJsonAsync<ColumnDto>($"api/columns/{id}");

    public async Task<ColumnDto> CreateAsync(CreateColumnRequest request)
    {
        var res = await http.PostAsJsonAsync("api/columns", request);
        res.EnsureSuccessStatusCode();
        return (await res.Content.ReadFromJsonAsync<ColumnDto>())!;
    }

    public async Task<ColumnDto?> UpdateAsync(Guid id, UpdateColumnRequest request)
    {
        var res = await http.PutAsJsonAsync($"api/columns/{id}", request);

        if (res.StatusCode == HttpStatusCode.NotFound)
            return null;

        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<ColumnDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var res = await http.DeleteAsync($"api/columns/{id}");

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }

    public async Task<bool> ReorderAsync(
        Guid boardId,
        IReadOnlyList<ColumnOrderDto> orders)
    {
        var res = await http.PostAsJsonAsync(
            $"api/columns/{boardId}/reorder",
            orders
        );

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }
}
