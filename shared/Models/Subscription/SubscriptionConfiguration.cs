using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shared.Enums;

namespace shared.Models;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.Property(x => x.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp without time zone")
            .ValueGeneratedOnAdd()
            .HasColumnName("created_at");

        builder.Property(x => x.UpdatedAt)
            .HasColumnType("timestamp without time zone")
            .IsRequired(false)
            .HasColumnName("updated_at");
        
        builder.Property(x => x.IsDeleted)
            .HasDefaultValue(false)
            .HasColumnName("is_deleted");
        
        builder.Property(x => x.SubscriptionType)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (SubscriptionType)Enum.Parse(typeof(SubscriptionType), v))
            .HasColumnName("subscription_type");
        
        builder.Property(x => x.StartDate)
            .IsRequired()
            .HasColumnType("timestamp without time zone")
            .ValueGeneratedOnAdd()
            .HasColumnName("start_date");

        builder.Property(x => x.EndDate)
            .IsRequired()
            .HasColumnType("timestamp without time zone")
            .ValueGeneratedNever()
            .HasColumnName("end_date");
        
        builder.Property(x => x.UsageLimit)
            .IsRequired()
            .HasColumnName("usage_limit");
        
        builder.Property(x => x.RemainingUsage)
            .IsRequired()
            .HasColumnName("remaining_usage");

        builder.HasOne(x => x.ApplicationUser)
            .WithOne(x => x.Subscription)
            .HasForeignKey<Subscription>(s => s.UserId);
    }
}