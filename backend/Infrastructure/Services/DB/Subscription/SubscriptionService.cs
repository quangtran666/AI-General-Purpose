using Microsoft.EntityFrameworkCore;
using shared.Data;

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

    public async Task DecrementUserSubscriptionAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await applicationDbContext.Users
            .Include(x => x.Subscription)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        
        user.Subscription.RemainingUsage--;
    }
}