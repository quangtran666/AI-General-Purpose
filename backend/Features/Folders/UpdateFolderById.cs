using System.Security.Claims;
using backend.Common;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;

namespace backend.Features.Folders;

public class UpdateFolderByIdController : ApiControllerBase
{
    [Authorize]
    [HttpPut("/api/folders/{id:int}")]
    public async Task<ActionResult> Update([FromRoute] int id, [FromBody] UpdateFolderByIdRequest request,
        CancellationToken cancellationToken)
    {
        await Mediator.Send(new UpdateFolderByIdCommand(id, request.FolderName, request.FolderDescription), cancellationToken);
        
        return NoContent();
    }
    
    public record UpdateFolderByIdRequest(string FolderName, string FolderDescription);
    
    public record UpdateFolderByIdCommand(int Id, string Name, string Description) : IRequest;
    
    internal class UpdateFolderByIdCommandValidator : AbstractValidator<UpdateFolderByIdCommand>
    {
        public UpdateFolderByIdCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Folder name is required");
            
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Folder description is required");
        }
    }
    
    internal class UpdateFolderByIdCommandHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor)
        : IRequestHandler<UpdateFolderByIdCommand>
    {
        public async Task Handle(UpdateFolderByIdCommand request, CancellationToken cancellationToken)
        {
            var folder = await applicationDbContext.Folders
                .FirstOrDefaultAsync(x => 
                    x.Id == request.Id && 
                    x.UserId == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), cancellationToken);
            
            if (folder == null) throw new Exception("Folder not found");
            
            folder.Name = request.Name;
            folder.Description = request.Description;
            await applicationDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}