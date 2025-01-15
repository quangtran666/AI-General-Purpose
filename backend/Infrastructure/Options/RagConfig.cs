using System.ComponentModel.DataAnnotations;

namespace backend.Infrastructure.Options;

public sealed class RagConfig
{
    public const string ConfigSectionName = "RagConfig";
    
    [Required]
    public int DataLoadingBatchSize { get; set; } = 10;
    
    [Required]
    public int DataLoadingBetweenBatchDelayInMs { get; set; } = 1000;
}