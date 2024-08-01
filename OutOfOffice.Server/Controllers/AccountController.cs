using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using OutOfOffice.Server.Models;
using OutOfOffice.Server.Models.SQLmodels;
using Microsoft.IdentityModel.Tokens;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AuthService _authService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            AuthService authService,
            ApplicationDbContext context,
            IUserService userService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authService = authService;
            _context = context;
            _userService = userService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.login);
                var result = await _signInManager.PasswordSignInAsync(model.login, model.Password, isPersistent: false, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var userEmployee = await _context.Employees.FindAsync(user.EmployeeId);
                    if (userEmployee != null && userEmployee.EmployeeStatus)
                    {
                        var token = await _authService.GenerateTokenAsync(user);
                        return Ok(new { token });

                    }
                    return Unauthorized(new { message = "Account is disabled or login is not matched to Profile" });
                }
                else if (result.IsLockedOut)
                {
                    return StatusCode(StatusCodes.Status423Locked, new { message = "User account locked out" });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid login attempt" });
                }
            }

            return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }

        [HttpPost("username")]
        public async Task<IActionResult> userName([FromBody] getUsernameID model)
        {
            try
            {
                var userName = await _userService.GetUsernameByIdAsync(model.Id);
                return Ok(userName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Download Error: {ex.Message}");
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> updateData([FromBody] registerUser model)
        {
            string userName = await _userService.GetUsernameByIdAsync(model.EmployeeId);
            if (userName.IsNullOrEmpty())
            {
                return BadRequest("Login Data not Found");
            }
            ApplicationUser user = await _userManager.FindByNameAsync(userName);
            user.changePassword = model.changePassword;
            await _userManager.SetUserNameAsync(user, model.Login);
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            if (model.Password == null)
            {
                return Ok("Login data updated successful");
            }
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, model.Password);

            if (result.Succeeded)
            {
                return Ok("Password reset successful.");
            }
            return BadRequest(result.Errors);

        }

        [HttpPost("passwordReset")]
        public async Task<IActionResult> resetPassword([FromBody] resetPasswordModel model)
        {
            var resultLogin = await _signInManager.PasswordSignInAsync(model.login, model.Password, isPersistent: false, lockoutOnFailure: false);

            if (resultLogin.Succeeded)
            {
                ApplicationUser user = await _userManager.FindByNameAsync(model.login);
                user.changePassword = false;

                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, resetToken, model.newPassword);
                if (result.Succeeded)
                {
                    var token = await _authService.GenerateTokenAsync(user);
                    return Ok(new { token });
                }
            }


            return BadRequest("Invalid login attempt");

        }
    }
}
