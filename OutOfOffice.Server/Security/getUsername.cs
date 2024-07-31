using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models;

public interface IUserService
{
    Task<string> GetUsernameByIdAsync(int EmployeeID);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetUsernameByIdAsync(int EmployeeID)
    {
        var username = await _context.Users
                             .Where(u => u.EmployeeId == EmployeeID)
                             .Select(u => u.UserName)
                             .FirstOrDefaultAsync();
        return username;
    }
}
