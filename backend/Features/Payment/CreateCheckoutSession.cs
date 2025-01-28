using backend.Common;
using backend.Infrastructure.Services.Stripe;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Payment;

public class CreateCheckoutSessionController : ApiControllerBase
{
    [Authorize]
    [HttpPost("/api/payment/checkout-session")]
    public async Task<ActionResult<string>> Create([FromBody] CreateCheckoutSessionCommand command, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }
    
    public record CreateCheckoutSessionCommand(string productId) : IRequest<string>;
    
    internal class CreateCheckoutSessionCommandHandler(
        StripeService stripeService,
        IHttpContextAccessor httpContextAccessor) 
        : IRequestHandler<CreateCheckoutSessionCommand, string>
    {
        public async Task<string> Handle(CreateCheckoutSessionCommand request, CancellationToken cancellationToken)
        {
            var successUrl = $"http://localhost:3000/checkout/success";
            var cancelUrl = $"http://localhost:3000/checkout/cancel";
            
            return await stripeService.CreateCheckoutSessionAsync(request.productId, successUrl, cancelUrl, cancellationToken);
        }
    }
}