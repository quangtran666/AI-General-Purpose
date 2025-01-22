namespace identityserver.Services.Mails;

public class AuthMessageSenderOptions
{
    public const string MailTrap = "MailTrap";

    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
}