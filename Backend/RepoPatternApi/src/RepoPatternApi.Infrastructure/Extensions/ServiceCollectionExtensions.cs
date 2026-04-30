
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Infrastructure.Repositories;

namespace RepoPatternApi.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Make configuration available to repositories
            services.AddSingleton(configuration);

            // Register all repositories
            services.AddSingleton<IKdsRepository, KdsRepository>();

            // Register services
            services.AddSingleton<IKdsService, KdsService>();

            return services;
        }
    }
}
