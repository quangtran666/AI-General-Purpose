using Duende.IdentityServer;
using Duende.IdentityServer.Models;

namespace identityserver;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
        new IdentityResource("identity", ["email"]),
    ];

    public static IEnumerable<ApiResource> ApiResources =>
    [
        new ApiResource("backendapi", "BackendAPI")
        {
            Scopes = { "backendapi.fullaccess" }
        }
    ];

    public static IEnumerable<ApiScope> ApiScopes =>
    [
        new ApiScope("backendapi.fullaccess")
    ];

    public static IEnumerable<Client> Clients =>
    [
        new()
        {
            ClientId = "next_web_app",
            ClientName = "Next Web App",
            ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },

            AllowOfflineAccess = true,
            AllowedGrantTypes = GrantTypes.Code,
            AccessTokenLifetime = 3600,
            RefreshTokenExpiration = TokenExpiration.Sliding,
            SlidingRefreshTokenLifetime = 1296000,
            AbsoluteRefreshTokenLifetime = 648000,

            RedirectUris = { "http://localhost:3000/api/auth/callback/identityserver" },
            PostLogoutRedirectUris = { "http://localhost:3000" },
            AllowedCorsOrigins = { "http://localhost:3000" },
            AllowedScopes =
            {
                IdentityServerConstants.StandardScopes.OpenId,
                IdentityServerConstants.StandardScopes.Profile,
                IdentityServerConstants.StandardScopes.OfflineAccess,
                "identity",
                "backendapi.fullaccess"
            },
            RequireConsent = true
        }
    ];
}