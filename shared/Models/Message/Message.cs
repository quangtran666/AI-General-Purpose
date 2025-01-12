using shared.Enums;

namespace shared.Models;

public sealed class Message : BaseEntity
{
    public MessageRole Role { get; set; }
    public string Content { get; set; }
    
    public int DocumentId { get; set; }
    public Document Document { get; set; }
}