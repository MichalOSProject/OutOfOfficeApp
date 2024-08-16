using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using OutOfOffice.Server.Models.SQLmodels;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

public class AuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration confguration, ApplicationDbContext context)
    {
        _userManager = userManager;
        _configuration = confguration;
        _context = context;
    }

    public async Task<string> GenerateTokenAsync(ApplicationUser user)
    {
        Employee employee = await _context.Employees.FindAsync(user.EmployeeId);
        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("position",employee.Position),
                new Claim("changePassword",user.changePassword.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expirationTime = DateTime.UtcNow.AddHours(1);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expirationTime,
            signingCredentials: creds);

        var newToken = new JwtSecurityTokenHandler().WriteToken(token);

        var jwtToken = new JwtTokens
        {
            Token = newToken,
            Jti = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value,
            UserId = employee.Id,
            Position = employee.Position,
            Expiration = expirationTime,
            Enabled = true
        };

        _context.JwtTokens.Add(jwtToken);
        _context.SaveChanges();

        return newToken;
    }
}
