namespace backend.Infrastructure.Options;

public sealed class S3Settings
{
    public const string SectionName = "S3Settings";

    public string Profile { get; init; } = string.Empty;
    public string Region { get; init; } = string.Empty;
    public string BucketName { get; init; } = string.Empty;
    public string AccessKey { get; init; } = string.Empty;
    public string SecretKey { get; init; } = string.Empty;
}