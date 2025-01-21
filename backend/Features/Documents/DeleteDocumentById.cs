using System.Security.Claims;
using backend.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.VectorData;
using shared.Data;
using shared.VectorModels;

namespace backend.Features.Documents;

public class DeleteDocumentByIdController : ApiControllerBase
{
    [Authorize]
    [HttpDelete("/api/documents/{id:int}")]
    public async Task<ActionResult> Delete([FromRoute] int id, CancellationToken cancellationToken)
    {
        await Mediator.Send(new DeleteDocumentByIdCommand(id), cancellationToken);
        
        return NoContent();
    }
    
    public record DeleteDocumentByIdCommand(int Id) : IRequest;
    
    internal class DeleteDocumentByIdCommandHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor,
        IVectorStore vectorStore) : IRequestHandler<DeleteDocumentByIdCommand>
    {
        public async Task Handle(DeleteDocumentByIdCommand request, CancellationToken cancellationToken)
        {
            var document = await applicationDbContext.Documents
                .FirstOrDefaultAsync(x => 
                    x.Id == request.Id && 
                    x.UserId == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), cancellationToken);
            
            if (document == null) throw new Exception("Document not found");
            
            applicationDbContext.Documents.Remove(document);
            var collection = vectorStore.GetCollection<Guid, TextSnippet>(document.VectorCollectionName);
            await Task.WhenAll(collection.DeleteCollectionAsync(cancellationToken),
                applicationDbContext.SaveChangesAsync(cancellationToken));
        }
    }
}