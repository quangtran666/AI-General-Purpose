using System.Security.Claims;
using backend.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.VectorData;
using shared.Data;
using shared.VectorModels;

namespace backend.Features.Folders;

public class DeleteFolderByIdController : ApiControllerBase
{
    [Authorize]
    [HttpDelete("/api/folders/{id:int}")]
    public async Task<ActionResult> Delete([FromRoute] int id, CancellationToken cancellationToken)
    {
        await Mediator.Send(new DeleteFolderByIdCommand(id), cancellationToken);
        
        return NoContent();
    }
    
    public record DeleteFolderByIdCommand(int Id) : IRequest;
    
    internal class DeleteFolderByIdCommandHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor,
        IVectorStore vectorStore) : IRequestHandler<DeleteFolderByIdCommand>
    {
        public async Task Handle(DeleteFolderByIdCommand request, CancellationToken cancellationToken)
        {
            var folder = await applicationDbContext.Folders
                .Include(x => x.Documents)
                .FirstOrDefaultAsync(x => 
                    x.Id == request.Id && 
                    x.UserId == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), cancellationToken);
            
            if (folder == null) throw new Exception("Folder not found");
            
            var deleteDocumentVectorStoreTasks = folder.Documents.Select(document =>
            {
                var collection = vectorStore.GetCollection<Guid, TextSnippet>(document.VectorCollectionName);
                return collection.DeleteCollectionAsync(cancellationToken);
            });
            
            applicationDbContext.Folders.Remove(folder);

            var task = new[] { applicationDbContext.SaveChangesAsync(cancellationToken) }
                .Concat(deleteDocumentVectorStoreTasks).ToArray();
            await Task.WhenAll(task);
        }
    }
}