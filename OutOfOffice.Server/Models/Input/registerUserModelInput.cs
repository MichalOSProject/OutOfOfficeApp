using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Input;

public partial class registerUserModelInput
{
    public string Login { get; set; } = null!;
    public string? Password { get; set; } = null!;
    public bool changePassword { get; set; }
    public int EmployeeId { get; set; }
}



