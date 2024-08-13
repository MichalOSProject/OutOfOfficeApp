using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Output
{
    public class projectModelOutput
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string ProjectType { get; set; } = null!;
        [Required]
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        [Required]
        public string Manager { get; set; } = null!;
        [Required]
        public int ManagerId { get; set; }
        public string? Comment { get; set; }
        [Required]
        public bool ProjectStatus { get; set; }
    }
}
