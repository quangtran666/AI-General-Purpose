using System.Security.Claims;
using System.Text.Json;
using backend.Common;
using backend.Common.Models;
using backend.Infrastructure.Services.DB.Document;
using backend.Infrastructure.Services.DB.Subscription;
using backend.Infrastructure.Services.RAG;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Embeddings;
using Microsoft.SemanticKernel.PromptTemplates.Handlebars;
using shared.Data;
using shared.Enums;
using shared.Exceptions;

namespace backend.Features.Documents;

public sealed class QueryDocumentController : ApiControllerBase
{
    [Authorize]
    [HttpPost("/api/documents/{documentId:int}/query")]
    public async Task<ActionResult<string>> Query([FromRoute] int documentId, [FromBody] QueryDocumentRequest request,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new QueryDocumentCommand(documentId, request.Query), cancellationToken));
    }
}

public sealed record QueryDocumentRequest(string Query);

public sealed record QueryDocumentCommand(int DocumentId, string Query) : IRequest<QueryDocumentResponse>;

public sealed record QueryDocumentResponse(string Content, List<Citation> Citations);

internal sealed class QueryDocumentCommandValidator : AbstractValidator<QueryDocumentCommand>
{
    public QueryDocumentCommandValidator()
    {
        RuleFor(x => x.Query)
            .NotNull()
            .WithMessage("Query is required");
    }
}

internal sealed class QueryDocumentCommandHandler(
    ApplicationDbContext applicationDbContext,
    Kernel kernel,
    IVectorStore vectorStore,
    IHttpContextAccessor httpContextAccessor,
#pragma warning disable SKEXP0001
    ITextEmbeddingGenerationService textEmbeddingGenerationService,
#pragma warning restore SKEXP0001
    IDocumentService documentService,
    ISubscriptionService subscriptionService,
    IVectorSearchService vectorSearchService
) : IRequestHandler<QueryDocumentCommand, QueryDocumentResponse>
{
    public async Task<QueryDocumentResponse> Handle(QueryDocumentCommand request, CancellationToken cancellationToken)
    {
        var userIdentifier = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        // Validate the user subscription
        if (!await subscriptionService.ValidateUserSubscriptionAsync(userIdentifier, cancellationToken))
            throw new Exception("User has no remaining usage.");

        // Retrive the document from the database
        var document = await documentService.GetDocumentByIdAsync(request.DocumentId, cancellationToken);
        if (document is null)
            throw new DocumentNotFoundException(request.DocumentId);

        await using var transaction = await applicationDbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Save the user query
            documentService.SaveDocument(document, request.Query, MessageRole.User);
            
            // Create Plugin and add to the kernel
            var searchPlugin = await vectorSearchService.CreateSearchPlugins(document.VectorCollectionName, vectorStore,
                textEmbeddingGenerationService, cancellationToken);
            kernel.Plugins.Add(searchPlugin);
            
            // Get the response 
            var response = await GetKernelResponse(request.Query, cancellationToken);
            var result = JsonSerializer.Deserialize<QueryDocumentResponse>(response.ToString());
            
            // Save the response
            documentService.SaveDocument(document, response.ToString(), MessageRole.AI);
            // Decrement the user subscription
            await subscriptionService.DecrementUsageUserSubscriptionAsync(userIdentifier, cancellationToken);
            
            await applicationDbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            
            return result;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    private async Task<FunctionResult> GetKernelResponse(string query, CancellationToken cancellationToken)
    {
        // Using JSON Schema for Structured Output
        var excutionSettings = new OpenAIPromptExecutionSettings
        {
#pragma warning disable SKEXP0010
            ResponseFormat = typeof(QueryDocumentResponse)
#pragma warning restore SKEXP0010
        };

        var response = await kernel.InvokePromptAsync(
            promptTemplate: """
                            Please use this information to answer the question:
                            {{#with (SearchPlugin-Search query)}}  
                              {{#each this}}  
                                Name: {{Name}}
                                Value: {{Value}}
                                Page Number: {{Link}}
                                -----------------
                              {{/each}}
                            {{/with}}

                            Include citations to the relevant information where it is referenced in the response.

                            Question: {{query}}
                            """,
            arguments: new KernelArguments(excutionSettings)
            {
                { "query", query }
            },
            templateFormat: "handlebars",
            promptTemplateFactory: new HandlebarsPromptTemplateFactory(),
            cancellationToken: cancellationToken);
        
        return response;
    }
}