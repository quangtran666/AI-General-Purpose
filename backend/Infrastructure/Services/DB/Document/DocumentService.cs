using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using shared.Data;
using shared.Enums;
using shared.Models;

namespace backend.Infrastructure.Services.DB.Document;

public class DocumentService(ApplicationDbContext applicationDbContext) : IDocumentService
{
    public async Task<shared.Models.Document> GetDocumentByIdAsync(int id, CancellationToken cancellationToken) =>
        await applicationDbContext.Documents
            .Include(x => x.Messages)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public void SaveDocument(shared.Models.Document document, string message, MessageRole role)
    {
        switch (role)
        {
            case MessageRole.AI:
                document.Messages.Add(new Message
                {
                    Content = message,
                    Role = role,
                });
                break;
            case MessageRole.User:
                document.Messages.Add(new Message
                {
                    Content = JsonSerializer.Serialize(message),
                    Role = role,
                });
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(role), role, null);
        }
    }
}