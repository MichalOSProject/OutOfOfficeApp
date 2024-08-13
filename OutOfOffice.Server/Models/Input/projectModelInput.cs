using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Input;

public partial class projectModelInput
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string ProjectType { get; set; } = null!;
    [Required]
    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }
    [Required]
    public int ManagerId { get; set; }

    public string? Comment { get; set; }
    [Required]
    public bool ProjectStatus { get; set; }
    [Required]
    public int[]? members { get; set; }

}