using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shared.Enums;

namespace shared.Models;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
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

        builder.Property(x => x.Role)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (MessageRole)Enum.Parse(typeof(MessageRole), v))
            .HasColumnName("role");
        
        builder.Property(x => x.Content)
            .IsRequired()
            .HasColumnType("jsonb")
            .HasColumnName("content");
    }
}