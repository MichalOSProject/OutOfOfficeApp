using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Input;

public partial class userModelInput
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Surname { get; set; } = null!;
    [Required]
    public string Subdivision { get; set; } = null!;
    [Required]
    public string Position { get; set; } = null!;
    [Required]
    public bool EmployeeStatus { get; set; }
    [Required]
    public int EmployeePartner { get; set; }
    [Required]
    public int FreeDays { get; set; }
    public string? Photo { get; set; }
    [Required]
    public string Login { get; set; } = null!;
    [Required]
    public string Password { get; set; } = null!;
    [Required]
    public bool changePassword { get; set; }
}