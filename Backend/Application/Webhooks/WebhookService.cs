using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;

namespace Application.Webhooks;

public class WebhookService(KansoDbContext db, IHttpClientFactory http) : IWebhookService
{
    public async Task AddAsync(Guid projectId, string url)
    {
        db.Webhooks.Add(new Webhook { ProjectId = projectId, Url = url });
        await db.SaveChangesAsync();
    }

    public async Task<List<string>> GetUrlsAsync(Guid projectId)
    {
        return await db.Webhooks
            .Where(w => w.ProjectId == projectId && w.Active)
            .Select(w => w.Url)
            .ToListAsync();
    }

    public async Task DisableAsync(Guid id)
    {
        var w = await db.Webhooks.FirstOrDefaultAsync(x => x.Id == id);
        if (w is null) return;

        w.Active = false;
        await db.SaveChangesAsync();
    }

    public async Task TriggerAsync(Guid projectId, object payload)
    {
        var urls = await GetUrlsAsync(projectId);
        if (urls.Count == 0) return;

        foreach (var url in urls)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    var client = http.CreateClient();
                    await client.PostAsJsonAsync(url, payload);
                }
                catch { }
            });
        }
    }
}
