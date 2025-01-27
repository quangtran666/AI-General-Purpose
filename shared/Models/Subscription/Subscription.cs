using shared.Enums;

namespace shared.Models;

public sealed class Subscription : BaseEntity
{
    public SubscriptionType SubscriptionType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int RemainingUsage { get; set; }
    public string UserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }
}