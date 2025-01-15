using System.Net;
using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Embeddings;
using shared.VectorModels;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.PageSegmenter;

namespace backend.Infrastructure.Services.RAG;

internal sealed class DataLoader(
    IVectorStore vectorStore,
#pragma warning disable SKEXP0001
    ITextEmbeddingGenerationService textEmbeddingGenerationService
#pragma warning restore SKEXP0001
) : IDataLoader
{
    public async Task LoadPdf(string collectionName, byte[] pdfBytes, int batchSize, int betweenBatchDelayInMs,
        CancellationToken cancellationToken)
    {
        var collection = vectorStore.GetCollection<Guid, TextSnippet>(collectionName);

        await collection.CreateCollectionIfNotExistsAsync(cancellationToken).ConfigureAwait(false);

        var sections = LoadText(pdfBytes, cancellationToken);
        var batches = sections.Chunk(batchSize);
        
        foreach (var batch in batches)
        {
            var recordTask = batch.Select(async content => new TextSnippet
            {
                Key = Guid.NewGuid(),
                Text = content.Text,
                PageNumber = content.PageNumber.ToString(),
                TextEmbedding = await GenerateEmbeddingsWithRetryAsync(textEmbeddingGenerationService, content.Text, cancellationToken).ConfigureAwait(false)
            });
            
            var records = await Task.WhenAll(recordTask).ConfigureAwait(false);
            var upsertKeys = collection.UpsertBatchAsync(records, cancellationToken: cancellationToken);
            await foreach (var key in upsertKeys.ConfigureAwait(false))
            {
                Console.WriteLine($"Upserted key: {key} into collection: {collectionName}");
            }

            await Task.Delay(betweenBatchDelayInMs, cancellationToken).ConfigureAwait(false);
        }
    }

#pragma warning disable SKEXP0001
    private static async Task<ReadOnlyMemory<float>> GenerateEmbeddingsWithRetryAsync(ITextEmbeddingGenerationService textEmbeddingGenerationService, string contentText, CancellationToken cancellationToken)
#pragma warning restore SKEXP0001
    {
        var tries = 0;

        while (true)
        {
            try
            {
                return await textEmbeddingGenerationService.GenerateEmbeddingAsync(contentText, cancellationToken: cancellationToken).ConfigureAwait(false);
            }
            catch (HttpOperationException ex) when (ex.StatusCode == HttpStatusCode.TooManyRequests)
            {
                tries++;

                if (tries < 3)
                {
                    Console.WriteLine($"Failed to generate embeddings for text: {contentText}. Retrying in 5 seconds.");
                    await Task.Delay(5000, cancellationToken).ConfigureAwait(false);
                }
                else
                {
                    throw;
                }
            }
        }
    }

    private static IEnumerable<RawContent> LoadText(byte[] pdfBytes, CancellationToken cancellationToken)
    {
        using var document = PdfDocument.Open(pdfBytes);

        foreach (var page in document.GetPages())
        {
            if (cancellationToken.IsCancellationRequested)
                break;

            var blocks = DefaultPageSegmenter.Instance.GetBlocks(page.GetWords());
            foreach (var block in blocks)
            {
                if (cancellationToken.IsCancellationRequested)
                    break;

                yield return new RawContent { Text = block.Text, PageNumber = page.Number };
            }
        }
    }
}