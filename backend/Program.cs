using backend;
using backend.Infrastructure.Options;

var builder = WebApplication.CreateBuilder(args);

var appConfig = new ApplicationConfig(builder.Configuration);

var app = builder
    .ConfigureServices(appConfig)
    .ConfigurePipeline();

app.Run();
