using Duende.IdentityServer;
using Duende.IdentityServer.Models;

namespace identityserver;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
        new IdentityResource("identity", ["email"])
    ];

    public static IEnumerable<ApiScope> ApiScopes =>
    [
        new ApiScope("scope1"),
        new ApiScope("scope2")
    ];

    public static IEnumerable<Client> Clients =>
    [
        // m2m client credentials flow client
        new()
        {
            ClientId = "m2m.client",
            ClientName = "Client Credentials Client",

            AllowedGrantTypes = GrantTypes.ClientCredentials,
            ClientSecrets = { new Secret("511536EF-F270-4058-80CA-1C89C192F69A".Sha256()) },

            AllowedScopes = { "scope1" }
        },
        new()
        {
            ClientId = "next_web_app",
            ClientName = "Next Web App",
            ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },

            AllowOfflineAccess = true,
            AllowedGrantTypes = GrantTypes.Code,

            RedirectUris = { "http://localhost:3000/api/auth/callback/identityserver" },
            PostLogoutRedirectUris = { "http://localhost:3000" },
            AllowedCorsOrigins = { "http://localhost:3000" },
            AllowedScopes =
            {
                IdentityServerConstants.StandardScopes.OpenId,
                IdentityServerConstants.StandardScopes.Profile,
                "identity",
            },
            RequireConsent = true
        }
    ];
}