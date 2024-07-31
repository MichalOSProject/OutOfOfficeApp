using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApprovalRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApprovalRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult<ApprovalRequest>> addApprovalRequest([FromBody] ApprovalRequest requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            _context.ApprovalRequests.Add(requestData);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Approval Request added successfully" });
        }

        [HttpPost("edit")]
        public async Task<ActionResult<ApprovalRequest>> editApprovalRequest([FromBody] ApprovalRequest requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            var ApprovalRequests = _context.ApprovalRequests.FirstOrDefault(item => item.Id == requestData.Id);
            if (ApprovalRequests == null)
            {
                return BadRequest("The Approval Request does not exist");
            }

            ApprovalRequests.ApproverId = requestData.ApproverId;
            ApprovalRequests.LeaveRequestId = requestData.LeaveRequestId;
            ApprovalRequests.RequestStatus = requestData.RequestStatus;
            ApprovalRequests.Comment = requestData.Comment;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Approval Request added successfully" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApprovalRequest>>> GetLeaveRequests()
        {
            try
            {
                var ApprovalRequests = await _context.ApprovalRequests.ToListAsync();
                return Ok(ApprovalRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Download Error: {ex.Message}");
            }
        }

    }
}