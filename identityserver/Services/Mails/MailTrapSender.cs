using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using MimeKit;

namespace identityserver.Services.Mails;

public class MailTrapSender(ILogger<MailTrapSender> logger, IOptions<AuthMessageSenderOptions> options) : IEmailSender
{
    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        if (string.IsNullOrWhiteSpace(options.Value.SmtpUsername) ||
            string.IsNullOrWhiteSpace(options.Value.SmtpPassword))
        {
            logger.LogError("MailTrap credentials are missing");
            return;
        }

        await Execute(email, subject, htmlMessage);
    }

    private async Task Execute(string email, string subject, string htmlMessage)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("QuangIdentityserver", "hello@chatpdfsemantic.online"));
            message.To.Add(new MailboxAddress(email, email));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlMessage
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync("live.smtp.mailtrap.io", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(options.Value.SmtpUsername, options.Value.SmtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            logger.LogInformation("Email sent successfully to {email}", email);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while sending the email");
        }
    }

}