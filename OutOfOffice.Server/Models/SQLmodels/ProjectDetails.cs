using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OutOfOffice.Server.Models.SQLmodels
{
    public class ProjectDetails
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int projectId { get; set; }
        [Required]
        public int employeeId { get; set; }

        ////Keys:

        //[ForeignKey("employeeId")]
        //[JsonIgnore]
        //public Employee Manager { get; set; }
        //[ForeignKey("projectId")]
        //[JsonIgnore]
        //public Project project { get; set; }
    }
}
