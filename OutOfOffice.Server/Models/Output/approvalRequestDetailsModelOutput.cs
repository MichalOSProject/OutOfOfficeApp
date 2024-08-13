using OutOfOffice.Server.Models.SQLmodels;
using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Output;

public partial class approvalRequestDetailsModelOutput
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Approver { get; set; } = null!;
    [Required]
    public RequestStatus Status { get; set; }
    public string? Comment { get; set; }
}