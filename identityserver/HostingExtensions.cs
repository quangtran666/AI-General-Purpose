using System.Net;
using System.Security.Cryptography.X509Certificates;
using Duende.IdentityServer;
using identityserver.ProfileServices;
using identityserver.Services.Mails;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Serilog;
using shared.Data;
using shared.Models;

namespace identityserver;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        builder.Services.Configure<AuthMessageSenderOptions>(
            builder.Configuration.GetSection(AuthMessageSenderOptions.MailTrap));
        builder.Services.AddTransient<IEmailSender, MailTrapSender>();

        var certificatePath = "/https/aspnetapp.pfx";
        var certificatePassword = builder.Configuration["ASPNETCORE_CERTIFICATE_PASSWORD"];

        builder.Services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo("/home/app/.aspnet/DataProtection-Keys"))
            .ProtectKeysWithCertificate(new X509Certificate2(
                certificatePath,
                certificatePassword
            ))
            .SetApplicationName("CHAT_PDF");

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            // options.KnownProxies.Add(IPAddress.Parse(builder.Configuration["Proxies:KnownProxies"]));
            
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });

        var chatPPFDBConnectionString = builder.Configuration.GetConnectionString("ChatPDFIdentityDBConnectionString");
        var identityServerDBConnectionString =
            builder.Configuration.GetConnectionString("IdentityServerDBConnectionString");
        var migrationsAssembly = typeof(Program).Assembly.GetName().Name;

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(chatPPFDBConnectionString));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>(configuration =>
            {
                configuration.SignIn.RequireConfirmedEmail = true;
                configuration.SignIn.RequireConfirmedAccount = true;

                configuration.User.RequireUniqueEmail = true;

                configuration.Password.RequireNonAlphanumeric = false;
                configuration.Password.RequireDigit = false;
                configuration.Password.RequireUppercase = false;
                configuration.Password.RequiredUniqueChars = 0;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                options.EmitStaticAudienceClaim = true;
            })
            .AddConfigurationStore(options =>
            {
                options.ConfigureDbContext = b => b.UseNpgsql(identityServerDBConnectionString,
                    sql => sql.MigrationsAssembly(migrationsAssembly));
            })
            .AddOperationalStore(options =>
            {
                options.ConfigureDbContext = b => b.UseNpgsql(identityServerDBConnectionString,
                    sql => sql.MigrationsAssembly(migrationsAssembly));
            })
            .AddAspNetIdentity<ApplicationUser>()
            .AddProfileService<CustomProfileService>();

        builder.Services.AddAuthentication()
            .AddGoogle(options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.ClientId = builder.Configuration["ExternalProviders:Google:ClientId"];
                options.ClientSecret = builder.Configuration["ExternalProviders:Google:ClientSecret"];
            })
            .AddGitHub(options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.ClientId = builder.Configuration["ExternalProviders:GitHub:ClientId"];
                options.ClientSecret = builder.Configuration["ExternalProviders:GitHub:ClientSecret"];
                options.CallbackPath = "/signin-oidc-github";
                options.Scope.Add("user:email");
            });

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}