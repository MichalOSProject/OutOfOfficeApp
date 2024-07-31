using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OutOfOffice.Server.Models.SQLmodels
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public int EmployeeId { get; set; }
        [Required]
        public bool changePassword { get; set; }

        ////Keys:
        //[JsonIgnore]
        //[ForeignKey("EmployeeId")]
        //public virtual Employee Employee { get; set; }
    }

}
