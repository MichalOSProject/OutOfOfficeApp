using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models;

public partial class registerUser
{
    public string Login { get; set; } = null!;
    public string? Password { get; set; } = null!;
    public bool changePassword { get; set; }
    public int EmployeeId { get; set; }
}



