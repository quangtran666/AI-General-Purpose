using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Data;
using Microsoft.SemanticKernel.Embeddings;
using shared.VectorModels;

namespace backend.Infrastructure.Services.RAG;

public class VectorSearchService : IVectorSearchService
{
    public async Task<KernelPlugin> CreateSearchPlugins(string vectorCollectionName, IVectorStore vectorStore,
#pragma warning disable SKEXP0001
        ITextEmbeddingGenerationService textEmbeddingGenerationService, CancellationToken cancellationToken)
#pragma warning restore SKEXP0001
    {
        // Setup vectorCollection, textSearch for the vectorCollection
        var vectorRecordCollection = vectorStore.GetCollection<Guid, TextSnippet>(vectorCollectionName);
#pragma warning disable SKEXP0001
        var textSearch = new VectorStoreTextSearch<TextSnippet>(
            vectorRecordCollection,
            textEmbeddingGenerationService);
#pragma warning restore SKEXP0001
        
        // Create options to describe the function i want to register
        var options = new KernelFunctionFromMethodOptions
        {
            FunctionName = "Search",
            Description = "Perform a search for content related to the specified query from a record collection.",
            Parameters =
            [
                new KernelParameterMetadata("query") { Description = "What to search for.", IsRequired = true },
                new KernelParameterMetadata("count")
                    { Description = "The number of results to return.", IsRequired = false, DefaultValue = 1 },
                new KernelParameterMetadata("skip")
                    { Description = "The number of results to skip.", IsRequired = false, DefaultValue = 0 }
            ]
        };
        
        // Build a text search plugins with vector store search and add to the kernel
        return KernelPluginFactory.CreateFromFunctions("SearchPlugin", "Search a record collection",
            [textSearch.CreateGetTextSearchResults(options)]);
    }
}