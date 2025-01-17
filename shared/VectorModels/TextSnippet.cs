using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel.Data;

namespace shared.VectorModels;

public class TextSnippet
{
    [VectorStoreRecordKey]
#pragma warning disable SKEXP0001
    [TextSearchResultName]
#pragma warning restore SKEXP0001
    public required Guid Key { get; set; }
    
    [VectorStoreRecordData]
#pragma warning disable SKEXP0001
    [TextSearchResultValue]
#pragma warning restore SKEXP0001
    public string? Text { get; set; }
    
    [VectorStoreRecordData]
#pragma warning disable SKEXP0001
    [TextSearchResultLink]
#pragma warning restore SKEXP0001
    public string? PageNumber { get; set; }
    
    [VectorStoreRecordVector(1536)] 
    public ReadOnlyMemory<float> TextEmbedding { get; set; }
}