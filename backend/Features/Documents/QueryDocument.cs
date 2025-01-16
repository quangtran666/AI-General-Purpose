using backend.Common;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Data;
using Microsoft.SemanticKernel.Embeddings;
using Microsoft.SemanticKernel.PromptTemplates.Handlebars;
using shared.Data;
using shared.VectorModels;

namespace backend.Features.Documents;

public class QueryDocumentController : ApiControllerBase
{
    [Authorize]
    [HttpPost("/api/documents/{documentId:int}/query")]
    public async Task<ActionResult<string>> Query([FromRoute] int documentId, [FromBody] QueryDocumentRequest request,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new QueryDocumentCommand(documentId, request.Query), cancellationToken));
    }
}

public record QueryDocumentRequest(string Query);

public record QueryDocumentCommand(int DocumentId, string Query) : IRequest<string>;

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
) : IRequestHandler<QueryDocumentCommand, string>
{
    public async Task<string> Handle(QueryDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await applicationDbContext.Documents
            .Where(x => x.Id == request.DocumentId)
            .FirstOrDefaultAsync(cancellationToken);

        var vectorRecordCollection = vectorStore.GetCollection<Guid, TextSnippet>(document.VectorCollectionName);
        
#pragma warning disable SKEXP0001
        var textSearch = new VectorStoreTextSearch<TextSnippet>(
            vectorRecordCollection,
            textEmbeddingGenerationService,
            new TextSearchStringMapper(result => (result as TextSnippet).Text),
            new TextSearchResultMapper(result =>
            {
                var castResult = result as TextSnippet;
#pragma warning disable SKEXP0001
                return new TextSearchResult(value: castResult.Text)
#pragma warning restore SKEXP0001
                    { Name = castResult.Text, Link = castResult.PageNumber };
            }));
#pragma warning restore SKEXP0001
        
        var searchPlugins = textSearch.CreateWithGetTextSearchResults("SearchPlugin");
        kernel.Plugins.Add(searchPlugins);

        var response = await kernel.InvokePromptAsync(
            promptTemplate: """
                            Please use this information to answer the question:
                            {{#with (SearchPlugin-GetTextSearchResults query)}}  
                              {{#each this}}  
                                Name: {{Name}}
                                Value: {{Value}}
                                Link: {{Link}}
                                -----------------
                              {{/each}}
                            {{/with}}

                            Include citations to the relevant information where it is referenced in the response.

                            Question: {{query}}
                            """,
            arguments: new KernelArguments
            {
                { "query", request.Query }
            },
            templateFormat: "handlebars",
            promptTemplateFactory: new HandlebarsPromptTemplateFactory(),
            cancellationToken: cancellationToken);

        return response.ToString();
    }
}