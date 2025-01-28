using backend.Common;
using backend.Infrastructure.Services.Stripe;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Payment;

public class StripeWebhookController(StripeService stripeService)
    : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        var stripeSignature = Request.Headers["Stripe-Signature"];

        try
        {
            await stripeService.HandleWebHookAsync(json, stripeSignature);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}