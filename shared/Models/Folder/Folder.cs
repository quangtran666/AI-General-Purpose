namespace shared.Models;

public sealed class Folder : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    
    public string UserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }

    public ICollection<Document> Documents { get; set; }
}