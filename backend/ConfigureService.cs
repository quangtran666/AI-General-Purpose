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
using shared.Data;
using shared.Interceptors;

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
            var s3Settings = sp.GetRequiredService<IOptions<S3Settings>>().Value;
            var config = new AmazonS3Config
            {
                Profile = new Profile(s3Settings.Profile),
                RegionEndpoint = RegionEndpoint.GetBySystemName(s3Settings.Region)
            };

            return new AmazonS3Client(config);
        });
        services.AddSingleton<S3Services>();


        var kernel = services.AddKernel();
        
        return services;
    }
}