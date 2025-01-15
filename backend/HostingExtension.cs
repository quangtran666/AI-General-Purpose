using Amazon;
using Amazon.S3;
using backend.Infrastructure.Options;
using backend.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using shared.Data;

namespace backend;

public static class HostingExtension
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder app, ApplicationConfig applicationConfig)
    {
        app.Services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                options.Authority = "https://localhost:5002";
                options.TokenValidationParameters.ValidateAudience = false;
            });

        app.Services.AddAuthorization();

        app.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        app.Services.AddEndpointsApiExplorer();
        app.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "VSA Backend", Version = "v1" }));

        app.Services.AddCors(options => options.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }));

// builder.Services.AddProblemDetails();

        app.Services.AddApplication(applicationConfig);
        app.Services.AddInfrastructure(applicationConfig);

// builder.Services.AddHealthChecks();
        app.Services.AddHttpContextAccessor();

        return app.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors();
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        
        return app;
    }
}