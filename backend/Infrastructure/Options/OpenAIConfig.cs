using System.ComponentModel.DataAnnotations;

namespace backend.Infrastructure.Options;

public sealed class OpenAIConfig
{
    public const string ConfigSectionName = "OpenAI";

    [Required]
    public string ModelId { get; set; } = string.Empty;
    
    [Required]
    public string ApiKey { get; set; } = string.Empty;

    [Required]
    public string? OrgId { get; set; } = string.Empty;
}