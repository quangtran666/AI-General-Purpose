using backend.Common;
using backend.Infrastructure.Services;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;

namespace backend.Features.Documents;

public class GetDocumentController : ApiControllerBase
{
    [Authorize]
    [HttpGet("/api/documents")]
    public async Task<ActionResult<DocumentDto>> Get([FromQuery] GetDocumentQuery query, CancellationToken cancellationToken)
    {
        var document = await Mediator.Send(query, cancellationToken);
        return document is null ? NotFound() : Ok(document);
    }
}

public record GetDocumentQuery(int Id) : IRequest<DocumentDto>;
    
public record DocumentDto(string Name, string presignedUrl, int? FolderId, string UserId);

internal sealed class GetDocumentQueryValidator : AbstractValidator<GetDocumentQuery>
{
    public GetDocumentQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required");
    }
}

internal sealed class GetDocumentQueryHandler(S3Services s3Services, ApplicationDbContext applicationDbContext) : IRequestHandler<GetDocumentQuery, DocumentDto>
{
    public async Task<DocumentDto> Handle(GetDocumentQuery request, CancellationToken cancellationToken)
    {
        var document = await applicationDbContext
            .Documents
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            
        if (document is null) return null;
            
        var presignedUrl = await s3Services.GetPresignedUrlAsync(document.StorageKey!);

        return new DocumentDto(document.Name, presignedUrl, document.FolderId, document.UserId);
    }
}