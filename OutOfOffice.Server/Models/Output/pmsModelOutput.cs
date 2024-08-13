using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Output
{
    public class pmsModelOutput
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public String Name { get; set; }
        [Required]
        public bool Status { get; set; }
    }
}
