using Microsoft.EntityFrameworkCore;
using shared.Data;
using shared.Enums;

namespace backend.Infrastructure.Services.DB.Subscription;

public class SubscriptionService(ApplicationDbContext applicationDbContext) : ISubscriptionService
{
    public async Task<bool> ValidateUserSubscriptionAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await applicationDbContext.Users
            .Include(x => x.Subscription)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

        return user.Subscription.RemainingUsage > 0 && user.Subscription.EndDate > DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
    }

    public async Task DecrementUsageUserSubscriptionAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await applicationDbContext.Users
            .Include(x => x.Subscription)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        
        user.Subscription.RemainingUsage--;
    }

    public async Task UpgradeUserSubscriptionAsync(string userId, CancellationToken cancellationToken)
    {
        const int freeToPaidUsage = 500;
        
        var user = await applicationDbContext.Users
            .Include(x => x.Subscription)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        
        user.Subscription.SubscriptionType = SubscriptionType.Paid;
        user.Subscription.RemainingUsage = freeToPaidUsage;
        user.Subscription.EndDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMonths(1), DateTimeKind.Unspecified);
        
        await applicationDbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DowngradeUserSubscriptionAsync(string userId, CancellationToken cancellationToken)
    {
        const int paidToFreeUsage = 10;
        
        var user = await applicationDbContext.Users
            .Include(x => x.Subscription)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        
        user.Subscription.SubscriptionType = SubscriptionType.Free;
        user.Subscription.RemainingUsage = paidToFreeUsage;
        user.Subscription.EndDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMonths(1), DateTimeKind.Unspecified);
        
        await applicationDbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task RenewUserSubscriptionAsync(string userId, CancellationToken cancellationToken)
    {
        const int premiumUsage = 500;
        
        var user = await applicationDbContext.Users
            .Include(x => x.Subscription)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

        user.Subscription.RemainingUsage = premiumUsage;
        user.Subscription.EndDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMonths(1), DateTimeKind.Unspecified);
        
        await applicationDbContext.SaveChangesAsync(cancellationToken);
    }
}