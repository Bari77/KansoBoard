namespace KansoBoard.Application.Webhooks;

public interface IWebhookService
{
    Task AddAsync(Guid projectId, string url);
    Task<List<string>> GetUrlsAsync(Guid projectId);
    Task DisableAsync(Guid id);
    Task TriggerAsync(Guid projectId, object payload);
}
