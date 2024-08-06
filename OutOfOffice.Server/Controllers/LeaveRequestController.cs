using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaveRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult<LeaveRequest>> addLeaveRequest([FromBody] LeaveRequest requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            _context.LeaveRequests.Add(requestData);
            await _context.SaveChangesAsync();

            var hrManager = _context.Employees
                .Where(item => item.Id == requestData.EmployeeId)
                .Select(item => item.EmployeePartner)
                .FirstOrDefault();

            var newHRApprovalRequest = new ApprovalRequest
            {
                ApproverId = hrManager,
                LeaveRequestId = requestData.Id,
                Status = RequestStatus.New,
                Comment = null
            };

            _context.ApprovalRequests.Add(newHRApprovalRequest);

            var projects = await _context.ProjectsDetails
                .Where(item => item.employeeId == requestData.EmployeeId)
                .Select(item => item.projectId).
                ToArrayAsync();

            if (projects == null)
            {
                return Ok("No projects Manager included");
            }

            var projectManagers = await _context.Projects
                .Where(item => projects.Contains(item.Id) && item.ProjectStatus == true)
                .Select(item => item.ManagerId)
                .ToArrayAsync();

            foreach (int idManager in projectManagers)
            {
                var newPMsApprovalRequest = new ApprovalRequest
                {
                    ApproverId = idManager,
                    LeaveRequestId = requestData.Id,
                    Status = RequestStatus.New,
                    Comment = null
                };
                _context.ApprovalRequests.Add(newPMsApprovalRequest);
            }
            await _context.SaveChangesAsync();

            return Ok(new { message = "Leave Request added successfully" });
        }

        [HttpPost("edit")]
        public async Task<ActionResult<LeaveRequest>> editLeaveRequest([FromBody] LeaveRequest requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            var LeaveRequests = _context.LeaveRequests.FirstOrDefault(item => item.Id == requestData.Id);
            if (LeaveRequests == null)
            {
                return BadRequest("The LeaveRequest does not exist");
            }

            LeaveRequests.EmployeeId = requestData.EmployeeId;
            LeaveRequests.AbsenceReason = requestData.AbsenceReason;
            LeaveRequests.StartDate = requestData.StartDate;
            LeaveRequests.EndDate = requestData.EndDate;
            LeaveRequests.Comment = requestData.Comment;
            LeaveRequests.RequestStatus = requestData.RequestStatus;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Leave Request added successfully" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequests()
        {
            try
            {
                var LeaveRequests = await _context.LeaveRequests.ToListAsync();
                return Ok(LeaveRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Download Error: {ex.Message}");
            }
        }

    }
}