using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using shared.Data;

namespace backend;

public static class HostingExtension
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder app)
    {
        var chatPPFDBConnectionString = app.Configuration.GetConnectionString("ChatPDFIdentityDBConnectionString");
        app.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(chatPPFDBConnectionString));
        
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

        app.Services.AddApplication();
        app.Services.AddInfrastructure(app.Configuration);

// builder.Services.AddHealthChecks();
        app.Services.AddHttpContextAccessor();

        return app.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "VSA Backend v1");
                options.RoutePrefix = string.Empty;
            });
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();
        
        return app;
    }
}