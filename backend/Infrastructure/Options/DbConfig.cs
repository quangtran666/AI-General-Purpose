namespace backend.Infrastructure.Options;

public sealed class DbConfig
{
    public const string ConfigSectionName = "DbConfig";
    
    public string ConnectionString { get; set; } = string.Empty;
}