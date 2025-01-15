using Microsoft.Extensions.VectorData;

namespace shared.VectorModels;

public class TextSnippet
{
    [VectorStoreRecordKey]
    public required Guid Key { get; set; }
    
    [VectorStoreRecordData] 
    public string? Text { get; set; }
    
    [VectorStoreRecordData] 
    public string? PageNumber { get; set; }
    
    [VectorStoreRecordVector(1536)] 
    public ReadOnlyMemory<float> TextEmbedding { get; set; }
}