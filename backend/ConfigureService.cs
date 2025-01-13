using backend.Common.Behaviours;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using shared.Data;
using shared.Interceptors;

namespace backend;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddMediatR(options =>
        {
            options.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);

            options.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var chatPPFDBConnectionString = configuration.GetConnectionString("ChatPDFIdentityDBConnectionString");
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(chatPPFDBConnectionString);
            options.AddInterceptors(new AuditableEntityInterceptor());
        });

        return services;
    }
}