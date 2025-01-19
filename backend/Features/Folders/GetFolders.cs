using System.Security.Claims;
using backend.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;

namespace backend.Features.Folders;

public class GetFoldersController : ApiControllerBase
{
    [Authorize]
    [HttpGet("/api/folders")]
    public async Task<ActionResult<List<FoldersDto>>> Get(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetFoldersQuery(), cancellationToken));
    }
    
    public record GetFoldersQuery : IRequest<List<FoldersDto>>;
    
    public record FoldersDto(int FolderId, string FolderName, string FolderDescription);
    
    internal class GetFoldersQueryHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor) : IRequestHandler<GetFoldersQuery, List<FoldersDto>>
    {
        public async Task<List<FoldersDto>> Handle(GetFoldersQuery request, CancellationToken cancellationToken)
        {
            return await applicationDbContext.Folders
                .AsNoTracking()
                .Where(x => x.UserId == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier))
                .Select(x => new FoldersDto(x.Id, x.Name, x.Description))
                .ToListAsync(cancellationToken);
        }
    }
}