using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace KansoBoard.ApiClient;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddKansoBoardApiClient(this IServiceCollection services, Action<KansoBoardApiClientOptions> configure)
    {
        services
            .AddOptions<KansoBoardApiClientOptions>()
            .Configure(configure)
            .Validate(options =>
                !string.IsNullOrWhiteSpace(options.BaseUrl),
                "KansoBoardApiClientOptions.BaseUrl must be provided.")
            .Validate(options =>
                Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out _),
                "KansoBoardApiClientOptions.BaseUrl must be a valid absolute URI.")
            .Validate(options => !string.IsNullOrWhiteSpace(options.ApiKey), "KansoBoardApiClientOptions.ApiKey must be provided.")
            .ValidateOnStart();

        services.AddTransient<ApiKeyHandler>();

        services.AddHttpClient<IKansoBoardApiClient, KansoBoardApiClient>((sp, client) =>
        {
            var options = sp.GetRequiredService<IOptions<KansoBoardApiClientOptions>>().Value;

            client.BaseAddress = new Uri(options.BaseUrl);
        }).AddHttpMessageHandler<ApiKeyHandler>();

        return services;
    }
}