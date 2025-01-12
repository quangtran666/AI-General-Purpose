using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace shared.Models;

public class FolderConfiguration : IEntityTypeConfiguration<Folder>
{
    public void Configure(EntityTypeBuilder<Folder> builder)
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
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasOne(x => x.ApplicationUser)
            .WithMany(x => x.Folders)
            .HasForeignKey(x => x.UserId);
        
        builder.HasMany(x => x.Documents)
            .WithOne(x => x.Folder)
            .HasForeignKey(x => x.FolderId)
            .IsRequired(false);
    }
}