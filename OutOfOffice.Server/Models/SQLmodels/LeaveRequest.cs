using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OutOfOffice.Server.Models.SQLmodels;

public partial class LeaveRequest
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public int EmployeeId { get; set; }
    [Required]
    public string AbsenceReason { get; set; } = null!;
    [Required]
    public DateOnly StartDate { get; set; }
    [Required]
    public DateOnly EndDate { get; set; }

    public string? Comment { get; set; }
    [Required]
    public LeaveRequestStatus RequestStatus { get; set; }

    ////Keys:

    //[ForeignKey("EmployeeId")]
    //[JsonIgnore]
    //public Employee Leaver { get; set; }
}

public enum LeaveRequestStatus : int
{
    New = 0,
    Rejected = 1,
    Approved = 2,
    Cancelled = 3
}
