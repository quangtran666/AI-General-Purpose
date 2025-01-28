using System.Security.Claims;
using backend.Infrastructure.Services.DB.Subscription;
using Stripe;
using Stripe.Checkout;
using Stripe.Entitlements;

namespace backend.Infrastructure.Services.Stripe;

public class StripeService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _secretKey;
    private readonly string _webhookSecret;
    private readonly ILogger<StripeService> _logger;
    private readonly ISubscriptionService _subscriptionService;

    public StripeService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<StripeService> logger, ISubscriptionService subscriptionService)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _subscriptionService = subscriptionService;
        _secretKey = configuration["Payments:Stripe:SecretKey"];
        _webhookSecret = configuration["Payments:Stripe:WebhookSecret"];
        StripeConfiguration.ApiKey = _secretKey;
    }

    public async Task<string> CreateCheckoutSessionAsync(string priceId, string successUrl, string cancelUrl,
        CancellationToken cancellationToken)
    {
        var userIdentifier = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes =
            [
                "card"
            ],
            Mode = "subscription",
            LineItems =
            [
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1,
                }
            ],
            SubscriptionData = new SessionSubscriptionDataOptions
            {
                Metadata = new Dictionary<string, string>()
                {
                    { "userId", userIdentifier }
                }
            },
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options, cancellationToken: cancellationToken);

        return session.Url;
    }

    public async Task HandleWebHookAsync(string requestbody, string stripeSignature)
    {
        var stripeEvent = EventUtility.ConstructEvent(requestbody, stripeSignature, _webhookSecret);

        switch (stripeEvent.Type)
        {
            case EventTypes.CustomerSubscriptionDeleted:
            {
                var subscription = stripeEvent.Data.Object as Subscription;
                if (!subscription.Metadata.TryGetValue("userId", out var userId))
                {
                    _logger.LogWarning("No userId found in subscription metadata");
                    break;
                }

                await _subscriptionService.DowngradeUserSubscriptionAsync(userId, CancellationToken.None);
                _logger.LogInformation("Subscription downgraded for user {0}", userId);
                break;
            }
            case EventTypes.CustomerSubscriptionCreated: 
            {
                var subscription = stripeEvent.Data.Object as Subscription;
                if (!subscription.Metadata.TryGetValue("userId", out var userId))
                {
                    _logger.LogWarning("No userId found in subscription metadata");
                    break;
                }
                await _subscriptionService.UpgradeUserSubscriptionAsync(userId, CancellationToken.None);
                _logger.LogInformation("Subscription upgraded for user {0}", userId);
                break;
            }
            case EventTypes.CustomerSubscriptionUpdated:
            {
                var subscription = stripeEvent.Data.Object as Subscription;
                if (!subscription.Metadata.TryGetValue("userId", out var userId))
                {
                    _logger.LogWarning("No userId found in subscription metadata");
                    break;
                }
                await _subscriptionService.RenewUserSubscriptionAsync(userId, CancellationToken.None);
                _logger.LogInformation("Subscription renewed for user {0}", userId);
                break;
            }
            default:
            {
                if (stripeEvent.Type == EventTypes.EntitlementsActiveEntitlementSummaryUpdated)
                {
                    var summary = stripeEvent.Data.Object as ActiveEntitlementSummary;
                }
                else
                {
                    _logger.LogWarning("Unhandled event type: {0}", stripeEvent.Type);
                }

                break;
            }
        }
    }
}