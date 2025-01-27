using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Embeddings;

namespace backend.Infrastructure.Services.RAG;

public interface IVectorSearchService
{
#pragma warning disable SKEXP0001
    Task<KernelPlugin> CreateSearchPlugins(string vectorCollectionName, IVectorStore vectorStore,
        ITextEmbeddingGenerationService textEmbeddingGenerationService, CancellationToken cancellationToken);
#pragma warning restore SKEXP0001
}