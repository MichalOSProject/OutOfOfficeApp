using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OutOfOffice.Server.Models.SQLmodels;


public partial class Project
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

    ////Keys:

    //[ForeignKey("ManagerId")]
    //[JsonIgnore]
    //public Employee Manager { get; set; }
}
