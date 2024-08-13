using OutOfOffice.Server.Models.SQLmodels;
using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Models.Output
{
    public class leaveRequestModelOutput
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Employee { get; set; }
        [Required]
        public string AbsenceReason { get; set; } = null!;
        [Required]
        public DateOnly StartDate { get; set; }
        [Required]
        public DateOnly EndDate { get; set; }

        public string? Comment { get; set; }
        [Required]
        public LeaveRequestStatus RequestStatus { get; set; }
    }
}
