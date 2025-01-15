namespace backend.Infrastructure.Services.RAG;

internal interface IDataLoader
{
    Task LoadPdf(string collectionName, byte[] pdfBytes, int batchSize, int betweenBatchDelayInMs, CancellationToken cancellationToken);
}