using System.Security.Claims;
using backend.Common;
using backend.Infrastructure.Options;
using backend.Infrastructure.Services;
using backend.Infrastructure.Services.RAG;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shared.Data;
using shared.Helpers;
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
}

public record CreateDocumentCommand(IFormFile File, int? FolderId) : IRequest<int>;

internal sealed class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
{
    private const int MaxFileSizeInMb = 6;
    private const int MaxFileSizeInBytes = MaxFileSizeInMb * 1024 * 1024;

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

                if (file.Length > MaxFileSizeInBytes)
                {
                    context.AddFailure("File", $"File size must be less than {MaxFileSizeInMb}MB");
                }
            });
    }
}

internal sealed class CreateDocumentCommandHandler(
    ApplicationDbContext applicationDbContext,
    IHttpContextAccessor httpContextAccessor,
    S3Services s3Services,
    IDataLoader dataLoader,
    ApplicationConfig applicationConfig) : IRequestHandler<CreateDocumentCommand, int>
{
    public async Task<int> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        var storageKey = $"pdfs/{Guid.NewGuid()}";
        var fileBtyes = await FileHelper.ReadStreamToByteArrayAysnc(request.File.OpenReadStream(), cancellationToken);
        await s3Services.UploadFileAsync(new MemoryStream(fileBtyes), storageKey, cancellationToken);
        
        var userId = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? throw new InvalidOperationException("UserName Identifier not found");
        var collectionName = $"pdfs-{Guid.NewGuid()}-{userId}-{request.File.FileName}";
        var document = new Document
        {
            Name = request.File.FileName,
            StorageKey = storageKey,
            FolderId = request.FolderId,
            UserId = userId,
            VectorCollectionName = collectionName
        };
        applicationDbContext.Documents.Add(document);
        await applicationDbContext.SaveChangesAsync(cancellationToken);
        
        await dataLoader.LoadPdf(collectionName, fileBtyes, applicationConfig.RagConfig.DataLoadingBatchSize,
            applicationConfig.RagConfig.DataLoadingBetweenBatchDelayInMs, cancellationToken);
        
        
        return document.Id;
    }
}