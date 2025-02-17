﻿using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using IdentityModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using shared.Enums;
using shared.Models;

namespace identityserver.Pages.Account.Register
{
    [AllowAnonymous]
    public class RegisterModel(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<RegisterModel> logger,
        IEmailSender emailSender)
        : PageModel
    {
        [BindProperty] public InputModel Input { get; set; }

        public string ReturnUrl { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public async Task OnGetAsync(string returnUrl = null)
        {
            ReturnUrl = returnUrl;
            ExternalLogins = (await signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");
            ExternalLogins = (await signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (ModelState.IsValid)
            {
                // Kiểm tra xem email đã tồn tại chưa
                var existingUser = await userManager.FindByEmailAsync(Input.Email);
                if (existingUser != null)
                {
                    // Kiểm tra xem user có password hay không
                    var hasPassword = await userManager.HasPasswordAsync(existingUser);
                    if (!hasPassword)
                    {
                        // Nếu chưa có password (user được tạo từ external login), thêm password
                        var addPasswordResult = await userManager.AddPasswordAsync(existingUser, Input.Password);
                        if (addPasswordResult.Succeeded)
                        {
                            logger.LogInformation("Password added to existing account.");
                            await signInManager.SignInAsync(existingUser, isPersistent: false);
                            return LocalRedirect(returnUrl);
                        }
                        foreach (var error in addPasswordResult.Errors)
                        {
                            ModelState.AddModelError(string.Empty, error.Description);
                        }
                        return Page();
                    }
                    // Nếu đã có password, báo lỗi email đã tồn tại
                    ModelState.AddModelError(string.Empty, "Email already exists.");
                    return Page();
                }

                // Nếu email chưa tồn tại, tạo user mới như bình thường
                var user = new ApplicationUser { UserName = Input.Email, Email = Input.Email };
                var result = await userManager.CreateAsync(user, Input.Password);
                
                if (result.Succeeded)
                {
                    // Thêm claims cho user
                    await userManager.AddClaimsAsync(user, [
                        new Claim(JwtClaimTypes.Name, user.UserName),
                        new Claim(JwtClaimTypes.GivenName, user.UserName),
                        new Claim(JwtClaimTypes.FamilyName, user.UserName),
                        new Claim(JwtClaimTypes.WebSite, "https://www.example.com"),
                    ]);
                    
                    // Thêm subscription cho user
                    var subscription = new Subscription
                    {
                        UserId = user.Id,
                        SubscriptionType = SubscriptionType.Free,
                        StartDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        EndDate = DateTime.SpecifyKind(DateTime.UtcNow.AddYears(100), DateTimeKind.Unspecified),
                        CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        RemainingUsage = 10,
                    };
                    user.Subscription = subscription;
                    await userManager.UpdateAsync(user);
                    
                    logger.LogInformation("User created a new account with password.");

                    var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var callbackUrl = Url.Page(
                        "/Account/ConfirmEmail/ConfirmEmail",
                        pageHandler: null,
                        values: new { userId = user.Id, code, returnUrl },
                        protocol: Request.Scheme);

                    await emailSender.SendEmailAsync(Input.Email, "Confirm your email",
                        $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                    if (userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        return RedirectToPage("/Account/RegisterConfirmation/RegisterConfirmation",
                            new { email = Input.Email, returnUrl });
                    }
                    else
                    {
                        await signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}