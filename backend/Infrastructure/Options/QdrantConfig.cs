using System.ComponentModel.DataAnnotations;

namespace backend.Infrastructure.Options;

public sealed class QdrantConfig
{
    public const string ConfigSectionName = "Qdrant";
    
    [Required]
    public string Host { get; set; } = string.Empty;

    public int Port { get; set; } = 6334;

    public bool Https { get; set; } = false;

    public string ApiKey { get; set; } = string.Empty;
}