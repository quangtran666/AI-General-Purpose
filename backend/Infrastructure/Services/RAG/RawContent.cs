namespace backend.Infrastructure.Services.RAG;

internal sealed class RawContent
{
    public string? Text { get; init; }
    public int PageNumber { get; init; }
}