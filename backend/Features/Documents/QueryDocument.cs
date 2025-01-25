using System.Text.Json;
using backend.Common;
using backend.Common.Models;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Data;
using Microsoft.SemanticKernel.Embeddings;
using Microsoft.SemanticKernel.PromptTemplates.Handlebars;
using shared.Data;
using shared.Enums;
using shared.Models;
using shared.VectorModels;

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
#pragma warning disable SKEXP0001
    ITextEmbeddingGenerationService textEmbeddingGenerationService
#pragma warning restore SKEXP0001
) : IRequestHandler<QueryDocumentCommand, QueryDocumentResponse>
{
    // Todo: Refactor this method
    public async Task<QueryDocumentResponse> Handle(QueryDocumentCommand request, CancellationToken cancellationToken)
    {
        // Retrive the document from the database
        var document = await applicationDbContext.Documents
            .Include(x => x.Messages)
            .Where(x => x.Id == request.DocumentId)
            .FirstOrDefaultAsync(cancellationToken);
        
        if (document is null) return null;

        await using var transaction = await applicationDbContext.Database.BeginTransactionAsync(cancellationToken);
        // Save the user query
        document.Messages.Add(new Message
        {
            Content = JsonSerializer.Serialize(request.Query),
            Role = MessageRole.User
        });

        // Setup vectorCollection, textSearch for the vectorCollection
        var vectorRecordCollection = vectorStore.GetCollection<Guid, TextSnippet>(document.VectorCollectionName);
#pragma warning disable SKEXP0001
        var textSearch = new VectorStoreTextSearch<TextSnippet>(
            vectorRecordCollection,
            textEmbeddingGenerationService);
#pragma warning restore SKEXP0001
        
        // Create options to describe the function i want to register
        var options = new KernelFunctionFromMethodOptions
        {
            FunctionName = "Search",
            Description = "Perform a search for content related to the specified query from a record collection.",
            Parameters =
            [
                new KernelParameterMetadata("query") { Description = "What to search for.", IsRequired = true },
                new KernelParameterMetadata("count")
                    { Description = "The number of results to return.", IsRequired = false, DefaultValue = 1 },
                new KernelParameterMetadata("skip")
                    { Description = "The number of results to skip.", IsRequired = false, DefaultValue = 0 }
            ]
        };
        
        // Build a text search plugins with vector store search and add to the kernel
        var searchPlugin = KernelPluginFactory.CreateFromFunctions("SearchPlugin", "Search a record collection",
            [textSearch.CreateGetTextSearchResults(options)]);
        kernel.Plugins.Add(searchPlugin);
        
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
                { "query", request.Query }
            },
            templateFormat: "handlebars",
            promptTemplateFactory: new HandlebarsPromptTemplateFactory(),
            cancellationToken: cancellationToken);

        // Deserialize the response
        var result = JsonSerializer.Deserialize<QueryDocumentResponse>(response.ToString());
        // Save the response
        document.Messages.Add(new Message
        {
            Content = response.ToString(),
            Role = MessageRole.AI
        });
        await applicationDbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        
        return result;
    }
}