// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.


using Microsoft.AspNetCore.Identity;

namespace shared.Models;

public sealed class ApplicationUser : IdentityUser
{
    public Subscription Subscription { get; set; }
    public ICollection<Folder> Folders { get; set; }
    public ICollection<Document> Documents { get; set; }    
}