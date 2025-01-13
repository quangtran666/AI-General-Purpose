using System.Security.Claims;
using backend.Common;
using backend.Infrastructure.Services;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shared.Data;
using shared.Models;

namespace backend.Features.Documents;

public class CreateDocumentController : ApiControllerBase
{
    [Authorize]
    [HttpPost("/api/documents")]
    public async Task<ActionResult<int>> Create([FromForm] CreateDocumentCommand command,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }

    public record CreateDocumentCommand(IFormFile File, int? FolderId) : IRequest<int>;

    internal sealed class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
    {
        public CreateDocumentCommandValidator()
        {
            RuleFor(x => x.File)
                .NotNull()
                .WithMessage("File is required");

            RuleFor(x => x.File)
                .Custom((file, context) =>
                {
                    if (file == null) return;

                    if (!Path.GetExtension(file.FileName).Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                    {
                        context.AddFailure("File", "File must be a PDF");
                    }
                });
        }
    }

    internal sealed class CreateDocumentCommandHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor,
        S3Services s3Services) : IRequestHandler<CreateDocumentCommand, int>
    {
        public async Task<int> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
        {
            await using var stream = request.File.OpenReadStream();

            var storageKey = $"pdfs/{Guid.NewGuid()}";
            await s3Services.UploadFileAsync(stream, storageKey, cancellationToken);

            var document = new Document
            {
                Name = request.File.FileName,
                StorageKey = storageKey,
                FolderId = request.FolderId,
                UserId = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier),
            };

            applicationDbContext.Documents.Add(document);
            await applicationDbContext.SaveChangesAsync(cancellationToken);

            return document.Id;
        }
    }
}