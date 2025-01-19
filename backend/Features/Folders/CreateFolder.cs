using System.Security.Claims;
using backend.Common;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shared.Data;
using shared.Models;

namespace backend.Features.Folders;

public class CreateFolderController : ApiControllerBase
{
    [Authorize]
    [HttpPost("/api/folders")]
    public async Task<ActionResult<int>> Create([FromBody] CreateFolderCommand command, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }
    
    public record CreateFolderCommand(string Name, string Description) : IRequest<int>;
    
    internal class CreateFolderCommandValidator : AbstractValidator<CreateFolderCommand>
    {
        public CreateFolderCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Name is required");
            
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Description is required");
        }
    }

    internal class CreateFolderCommandHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor)
        : IRequestHandler<CreateFolderCommand, int>
    {
        public async Task<int> Handle(CreateFolderCommand request, CancellationToken cancellationToken)
        {
            var folder = new Folder
            {
                Name = request.Name,
                Description = request.Description,
                UserId = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
            };
            
            applicationDbContext.Folders.Add(folder);
            await applicationDbContext.SaveChangesAsync(cancellationToken);
            return folder.Id;
        }
    }  
    
}