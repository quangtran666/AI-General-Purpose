using System.Security.Claims;
using backend.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.Data;
using shared.Enums;
using shared.Models;

namespace backend.Features.Users;

public class GetUserProfileController : ApiControllerBase
{
    [Authorize]
    [HttpGet("/api/profile")]
    public async Task<ActionResult<UserProfileDto>> Get(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetUserProfileQuery(), cancellationToken));
    }
    
    public record GetUserProfileQuery : IRequest<UserProfileDto>;
    
    public record UserProfileDto(string Email, string FullName, SubscriptionDto Subscription);
    
    public record SubscriptionDto(SubscriptionType SubscriptionType, DateTime StartDate, DateTime EndDate, int RemainingUsage);
    
    internal class GetUserProfileQueryHandler(
        ApplicationDbContext applicationDbContext,
        IHttpContextAccessor httpContextAccessor)
        : IRequestHandler<GetUserProfileQuery, UserProfileDto>
    {
        public async Task<UserProfileDto> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
        {
            var user = await applicationDbContext.Users.
                Include(x => x.Subscription)
                .FirstOrDefaultAsync(x => x.Id == httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), cancellationToken);
            
            return new UserProfileDto(
                user.Email, 
                user.UserName, 
                new SubscriptionDto(
                    user.Subscription.SubscriptionType, 
                    user.Subscription.StartDate, 
                    user.Subscription.EndDate, 
                    user.Subscription.RemainingUsage));
        }
    }
}