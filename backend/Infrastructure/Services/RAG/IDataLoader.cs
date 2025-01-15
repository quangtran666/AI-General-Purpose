namespace backend.Infrastructure.Services.RAG;

internal interface IDataLoader
{
    Task LoadPdf(string collectionName, Stream pdfStream, int batchSize, int betweenBatchDelayInMs, CancellationToken cancellationToken);
}