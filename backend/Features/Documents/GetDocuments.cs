using System.Security.Claims;
using backend.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;

namespace backend.Features.Documents;

public class GetDocumentsController : ApiControllerBase
{
    [Authorize]
    [HttpGet("/api/documents")]
    public async Task<ActionResult<List<DocumentsDto>>> Get(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetDocumentsQuery(), cancellationToken));
    }
}

public record GetDocumentsQuery : IRequest<List<DocumentsDto>>;

public record DocumentsDto(int DocumentId, string DocumentName, int? FolderId, string? FolderName, string? FolderDescription);

internal class GetDocumentsQueryHandler(
    ApplicationDbContext applicationDbContext,
    IHttpContextAccessor httpContextAccessor) : IRequestHandler<GetDocumentsQuery, List<DocumentsDto>>
{
    public async Task<List<DocumentsDto>> Handle(GetDocumentsQuery request, CancellationToken cancellationToken)
    {
        return await applicationDbContext.Documents
            .AsNoTracking()
            .Include(x => x.Folder)
            .Where(x => x.UserId == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier))
            .Select(x => new DocumentsDto(x.Id, x.Name, x.FolderId, x.Folder.Name, x.Folder.Description))
            .ToListAsync(cancellationToken);
    }
}
