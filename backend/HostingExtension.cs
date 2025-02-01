using System.Net;
using backend.Infrastructure.Options;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

namespace backend;

public static class HostingExtension
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder app, ApplicationConfig applicationConfig)
    {
        app.Host.UseSerilog((context, configuration) =>
        {
            configuration.ReadFrom.Configuration(context.Configuration);
        });
        
        app.Services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                options.Authority = app.Configuration["JwtSettings:Authority"];
                options.MetadataAddress = app.Configuration["JwtSettings:Authority"] + "/.well-known/openid-configuration";
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudiences = ["backendapi"],                
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    RequireExpirationTime = true,
                    ValidTypes = ["at+jwt"],
                    SignatureValidator = (token, parameters) => new JsonWebToken(token),
                    ValidateIssuer = true,
                    ValidIssuers = [app.Configuration["JwtSettings:Authority"]],
                };
            });

        app.Services.AddAuthorization();

        app.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            // options.KnownProxies.Add(IPAddress.Parse(app.Configuration["Proxies:KnownProxies"]));
            
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        }); 

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
        
        app.UseForwardedHeaders();
        app.UseSerilogRequestLogging();
        app.UseCors();
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        return app;
    }
}