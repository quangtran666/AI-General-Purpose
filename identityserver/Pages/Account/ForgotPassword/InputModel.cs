using System.ComponentModel.DataAnnotations;

namespace identityserver.Pages.Account.ForgotPassword;

public class InputModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    public string ReturnUrl { get; set; }
}