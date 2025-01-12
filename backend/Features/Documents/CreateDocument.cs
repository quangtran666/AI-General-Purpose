using backend.Common;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using shared.Data;

namespace backend.Features.Documents;

public class CreateDocumentController : ApiControllerBase
{
    [HttpPost("/api/documents")]
    public async Task<ActionResult<int>> Create(CreateDocumentCommand command)
    {
        return await Mediator.Send(command);
    }

    public record CreateDocumentCommand() : IRequest<int>;

    internal sealed class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
    {
        public CreateDocumentCommandValidator()
        {
            
        }
    }
    
    internal sealed class CreateDocumentCommandHandler(ApplicationDbContext applicationDbContext) : IRequestHandler<CreateDocumentCommand, int>
    {
        private readonly ApplicationDbContext _applicationDbContext;
        
        public Task<int> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }
    }
}