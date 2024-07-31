using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OutOfOffice.Server.Models.SQLmodels;

public partial class Employee
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

    ////Keys:

    //[ForeignKey("EmployeePartner")]
    //public Employee Partner { get; set; }
}


