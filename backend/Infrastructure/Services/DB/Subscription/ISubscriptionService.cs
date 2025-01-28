namespace backend.Infrastructure.Services.DB.Subscription;

public interface ISubscriptionService
{
    Task<bool> ValidateUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
    Task DecrementUsageUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
    Task UpgradeUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
    Task DowngradeUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
    Task RenewUserSubscriptionAsync(string userId, CancellationToken cancellationToken);
}