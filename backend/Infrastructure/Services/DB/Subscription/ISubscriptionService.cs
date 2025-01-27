namespace backend.Infrastructure.Services.DB.Subscription;

public interface ISubscriptionService
{
    Task<bool> ValidateUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
    Task DecrementUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
}