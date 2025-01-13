namespace shared.Models;

public sealed class Document : BaseEntity
{
    public string Name { get; set; }
    public string StorageKey { get; set; }
    
    public int? FolderId { get; set; }
    public Folder Folder { get; set; }

    public string UserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }

    public ICollection<Message> Messages { get; set; }
}