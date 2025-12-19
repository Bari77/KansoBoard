using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace KansoBoard.ApiClient;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddKansoBoardApiClient(this IServiceCollection services, Action<KansoBoardApiClientOptions> configure)
    {
        services.Configure(configure);

        services.AddTransient<ApiKeyHandler>();

        services.AddHttpClient<IKansoBoardApiClient, KansoBoardApiClient>((sp, client) =>
        {
            var options = sp.GetRequiredService<IOptions<KansoBoardApiClientOptions>>().Value;

            client.BaseAddress = new Uri(options.BaseUrl);
        }).AddHttpMessageHandler<ApiKeyHandler>();

        return services;
    }
}