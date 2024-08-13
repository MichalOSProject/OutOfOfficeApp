using OutOfOffice.Server.Models.SQLmodels;
using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Output;

public partial class approvalRequestExtendedModelOutput
{
    [Required]
    public int Id { get; set; }
    [Required]
    public int ApproverId { get; set; }
    [Required]
    public int LeaveRequestId { get; set; }
    [Required]
    public RequestStatus Status { get; set; }
    public string? Comment { get; set; }
    [Required]
    public int EmployeeId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Surname { get; set; }
    public DateOnly StartDate { get; set; }
    [Required]
    public DateOnly EndDate { get; set; }

}