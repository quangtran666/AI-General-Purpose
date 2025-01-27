using shared.Enums;

namespace backend.Infrastructure.Services.DB.Document;

public interface IDocumentService
{
    Task<shared.Models.Document> GetDocumentByIdAsync(int id, CancellationToken cancellationToken);
    void SaveDocument(shared.Models.Document document, string message, MessageRole role);
}