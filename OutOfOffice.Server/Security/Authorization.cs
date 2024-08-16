using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.Identity;
using OutOfOffice.Server.Models.SQLmodels;


namespace OutOfOffice.Server.Security
{
    public class PositionHandler : AuthorizationHandler<PositionRequirement>
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserService _userService;

        public PositionHandler(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IUserService userService)
        {
            _context = context;
            _userManager = userManager;
            _userService = userService;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PositionRequirement requirement)
        {
            var Jti = context.User.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

            var dbToken = _context.JwtTokens
                .Where(x => x.Jti.Equals(Jti))
                .First();

            if (dbToken == null)
            {
                context.Fail();
                return;
            }

            if (!dbToken.Enabled)
            {
                context.Fail();
                return;
            }

            if (dbToken.Expiration < DateTime.UtcNow)
            {
                dbToken.Enabled = false;
                _context.SaveChanges();
                context.Fail();
                return;
            }

            ApplicationUser user = await _userManager.FindByNameAsync(await _userService.GetUsernameByIdAsync(dbToken.UserId));

            if (user.changePassword)
            {
                context.Fail();
                return;
            }

            if (!requirement.RequiredPositions.Contains(dbToken.Position, StringComparer.OrdinalIgnoreCase))
            {
                context.Fail();
                return;
            }

            context.Succeed(requirement);
            return;
        }
    }

    public class PositionRequirement : IAuthorizationRequirement
    {
        public IEnumerable<string> RequiredPositions { get; }

        public PositionRequirement(IEnumerable<string> requiredPositions)
        {
            RequiredPositions = requiredPositions;
        }
    }

}
