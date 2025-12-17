using Contracts.Boards;
using System.Net;
using System.Net.Http.Json;

namespace ApiClient.Boards;

internal sealed class BoardsApi(HttpClient http) : IBoardsApi
{
    public async Task<BoardDto?> GetByIdAsync(Guid id)
        => await http.GetFromJsonAsync<BoardDto>($"api/boards/{id}");

    public async Task<IReadOnlyList<BoardDto>> GetByProjectAsync(Guid projectId)
        => await http.GetFromJsonAsync<List<BoardDto>>(
            $"api/boards/project/{projectId}"
        ) ?? [];

    public async Task<BoardDto> CreateAsync(CreateBoardRequest request)
    {
        var res = await http.PostAsJsonAsync("api/boards", request);
        res.EnsureSuccessStatusCode();
        return (await res.Content.ReadFromJsonAsync<BoardDto>())!;
    }

    public async Task<BoardDto?> UpdateAsync(Guid id, UpdateBoardRequest request)
    {
        var res = await http.PutAsJsonAsync($"api/boards/{id}", request);

        if (res.StatusCode == HttpStatusCode.NotFound)
            return null;

        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<BoardDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var res = await http.DeleteAsync($"api/boards/{id}");

        if (res.StatusCode == HttpStatusCode.NotFound)
            return false;

        res.EnsureSuccessStatusCode();
        return true;
    }
}

