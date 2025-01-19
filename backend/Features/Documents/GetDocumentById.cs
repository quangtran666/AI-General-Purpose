using backend.Common;
using backend.Infrastructure.Services;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;

namespace backend.Features.Documents;

public class GetDocumentByIdController : ApiControllerBase
{
    [Authorize]
    [HttpGet("/api/documents/{id:int}")]
    public async Task<ActionResult<DocumentByIdDto>> Get([FromRoute] int id, CancellationToken cancellationToken)
    {
        var document = await Mediator.Send(new GetDocumentByIdQuery(id), cancellationToken);
        return document is null ? NotFound() : Ok(document);
    }
}

public record GetDocumentByIdQuery(int Id) : IRequest<DocumentByIdDto>;
    
public record DocumentByIdDto(string Name, string presignedUrl, int? FolderId, string UserId, List<MessageByIdDto> Messages);

public record MessageByIdDto(string Content, string Role);

internal sealed class GetDocumentByIdQueryValidator : AbstractValidator<GetDocumentByIdQuery>
{
    public GetDocumentByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required");
    }
}

internal sealed class GetDocumentByIdQueryHandler(S3Services s3Services, ApplicationDbContext applicationDbContext) : IRequestHandler<GetDocumentByIdQuery, DocumentByIdDto>
{
    public async Task<DocumentByIdDto> Handle(GetDocumentByIdQuery request, CancellationToken cancellationToken)
    {
        var document = await applicationDbContext
            .Documents
            .Include(x => x.Messages)
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            
        if (document is null) return null;
            
        var presignedUrl = await s3Services.GetPresignedUrlAsync(document.StorageKey!);

        return new DocumentByIdDto(
            document.Name, 
            presignedUrl, 
            document.FolderId, 
            document.UserId, 
            document.Messages.Select(x => new MessageByIdDto(x.Content, x.Role.ToString())).ToList());
    }
}