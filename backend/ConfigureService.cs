using Amazon;
using Amazon.S3;
using backend.Common.Behaviours;
using backend.Infrastructure.Options;
using backend.Infrastructure.Services;
using backend.Infrastructure.Services.RAG;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Qdrant;
using Microsoft.SemanticKernel.Data;
using shared.Data;
using shared.Interceptors;
using shared.VectorModels;

namespace backend;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, ApplicationConfig applicationConfig)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddMediatR(options =>
        {
            options.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);

            options.AddOpenBehavior(typeof(ValidationBehavior<,>));
            options.AddOpenBehavior(typeof(LoggingBehavior<,>));
        });

        services.AddSingleton<IDataLoader, DataLoader>();
        services.AddSingleton(applicationConfig);

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, ApplicationConfig applicationConfig)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(applicationConfig.DbConfig.ConnectionString);
            options.AddInterceptors(new AuditableEntityInterceptor());
        });

        services.AddSingleton<IAmazonS3>(sp =>
        {
            var config = new AmazonS3Config
            {
                Profile = new Profile(applicationConfig.S3Settings.Profile),
                RegionEndpoint = RegionEndpoint.GetBySystemName(applicationConfig.S3Settings.Region)
            };

            return new AmazonS3Client(config);
        });
        services.AddSingleton<S3Services>();

        var kernel = services.AddKernel();
        kernel.AddOpenAIChatCompletion(
            applicationConfig.OpenAIConfig.ModelId,
            applicationConfig.OpenAIConfig.ApiKey,
            applicationConfig.OpenAIConfig.OrgId);
#pragma warning disable SKEXP0010
        kernel.AddOpenAITextEmbeddingGeneration(
            applicationConfig.OpenAiEmbeddingsConfig.ModelId,
            applicationConfig.OpenAiEmbeddingsConfig.ApiKey,
            applicationConfig.OpenAiEmbeddingsConfig.OrgId);
#pragma warning restore SKEXP0010
        kernel.AddQdrantVectorStore(
            applicationConfig.QdrantConfig.Host,
            applicationConfig.QdrantConfig.Port,
            applicationConfig.QdrantConfig.Https,
            applicationConfig.QdrantConfig.ApiKey);
        kernel.AddVectorStoreTextSearch<TextSnippet>(
            new TextSearchStringMapper(result => (result as TextSnippet).Text),
            new TextSearchResultMapper(result =>
            {
                var castResult = result as TextSnippet;
#pragma warning disable SKEXP0001
                return new TextSearchResult(value: castResult.Text)
#pragma warning restore SKEXP0001
                    { Name = castResult.Text, Link = castResult.PageNumber };
            }));
            
        return services;
    }
}