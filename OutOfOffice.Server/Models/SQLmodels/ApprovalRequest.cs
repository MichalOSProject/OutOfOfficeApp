﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OutOfOffice.Server.Models.SQLmodels;

public partial class ApprovalRequest
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public int ApproverId { get; set; }
    [Required]
    public int LeaveRequestId { get; set; }
    [Required]
    public string RequestStatus { get; set; } = null!;

    public string? Comment { get; set; }

    ////Keys:

    //[ForeignKey("ApproverId")]
    //public Employee Approver { get; set; }

    //[ForeignKey("LeaveRequestId")]
    //public LeaveRequest baseRequest { get; set; }
}
