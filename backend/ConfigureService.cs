using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using backend.Common.Behaviours;
using backend.Infrastructure.Options;
using backend.Infrastructure.Services;
using backend.Infrastructure.Services.DB.Document;
using backend.Infrastructure.Services.DB.Subscription;
using backend.Infrastructure.Services.RAG;
using backend.Infrastructure.Services.Stripe;
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
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly, includeInternalTypes: true);

        services.AddMediatR(options =>
        {
            options.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);

            options.AddOpenBehavior(typeof(ValidationBehavior<,>));
            options.AddOpenBehavior(typeof(LoggingBehavior<,>));
        });

        services.AddSingleton<IDataLoader, DataLoader>();
        services.AddSingleton(applicationConfig);

        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddScoped<IVectorSearchService, VectorSearchService>();
        
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
            var awsCredentials = new BasicAWSCredentials(applicationConfig.S3Settings.AccessKey, applicationConfig.S3Settings.SecretKey);

            return new AmazonS3Client(awsCredentials, RegionEndpoint.GetBySystemName(applicationConfig.S3Settings.Region));
        });
        services.AddSingleton<S3Services>();

        services.AddScoped<StripeService>();

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
            
        return services;
    }
}