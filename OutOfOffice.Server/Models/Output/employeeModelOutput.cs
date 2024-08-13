using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Output
{
    public class employeeModelOutput
    {
        [Required]
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
        public string EmployeePartner { get; set; }
        [Required]
        public int EmployeePartnerID { get; set; }
        [Required]
        public int FreeDays { get; set; }
        public string? Photo { get; set; }
    }
}
