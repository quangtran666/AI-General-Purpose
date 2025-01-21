using System.Security.Claims;
using backend.Common;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;

namespace backend.Features.Documents;

public class UpdateDocumentByIdController : ApiControllerBase
{
    [Authorize]
    [HttpPut("/api/documents/{id:int}")]
    public async Task<ActionResult<int>> Update([FromRoute] int id, [FromBody] UpdateDocumentByIdRequest command,
        CancellationToken cancellationToken)
    {
        await Mediator.Send(new UpdateDocumentByIdCommand(id, command.DocumentName), cancellationToken);
        
        return NoContent();
    }

    public record UpdateDocumentByIdRequest(string DocumentName);
    
    public record UpdateDocumentByIdCommand(int Id, string Name) : IRequest;
    
    internal class UpdateDocumentByIdCommandValidator : AbstractValidator<UpdateDocumentByIdCommand>
    {
        public UpdateDocumentByIdCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Document name is required");
        }
    }
    
    internal class UpdateDocumentByIdCommandHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor) : IRequestHandler<UpdateDocumentByIdCommand>
     {
        public async Task Handle(UpdateDocumentByIdCommand request, CancellationToken cancellationToken)
        {
            var document = await applicationDbContext.Documents
                .FirstOrDefaultAsync(x => 
                        x.Id == request.Id && 
                        x.UserId == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), cancellationToken);
            
            if (document == null) throw new Exception("Document not found");
            
            document.Name = request.Name;
            await applicationDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}