using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace shared.Models;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
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

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnName("name");

        builder.Property(x => x.StorageKey)
            .IsRequired()
            .HasColumnName("storage_key");
        
        builder.Property(x => x.VectorCollectionName)
            .IsRequired()
            .HasColumnName("vector_collection_name");

        builder.HasOne(x => x.ApplicationUser)
            .WithMany(x => x.Documents)
            .HasForeignKey(x => x.UserId);

        builder.HasMany(x => x.Messages)
            .WithOne(x => x.Document)
            .HasForeignKey(x => x.DocumentId);

        builder.HasOne(x => x.Folder)
            .WithMany(x => x.Documents)
            .HasForeignKey(x => x.FolderId)
            .IsRequired(false);
    }
}