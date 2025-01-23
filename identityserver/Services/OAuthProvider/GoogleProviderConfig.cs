namespace identityserver.Services.OAuthProvider;

public class GoogleProviderConfig
{
    public const string GoogleProviderConfigSection = "ExternalProviders:Google";
    
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
}