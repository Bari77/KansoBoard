using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace ApiClient;

internal sealed class ApiKeyHandler(IOptions<KansoBoardApiClientOptions> options) : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var apiKey = options.Value.ApiKey;

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("ApiKey", apiKey);
        }

        return base.SendAsync(request, cancellationToken);
    }
}
