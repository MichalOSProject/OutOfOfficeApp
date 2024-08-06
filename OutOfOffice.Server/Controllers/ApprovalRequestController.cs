using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models;
using OutOfOffice.Server.Models.SQLmodels;
using System.Collections.Immutable;
using System.ComponentModel.DataAnnotations;

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

        [HttpPost("edit")]
        public async Task<ActionResult<ApprovalRequest>> updateApprovalRequest([FromBody] updateRequestModel requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }
            if (requestData.status == 0)
            {
                return BadRequest("Status not updated");
            }

            var ApprovalRequests = _context.ApprovalRequests.FirstOrDefault(item => item.Id == requestData.id);
            if (ApprovalRequests == null)
            {
                return BadRequest("The Approval Request does not exist");
            }

            ApprovalRequests.Status = requestData.status;
            ApprovalRequests.Comment = requestData.comment;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Approval Request updated successfully" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApprovalRequest>>> GetLeaveRequests()
        {
            try
            {
                var ApprovalRequests = await _context.ApprovalRequests.ToListAsync();

                var approvalRequestDetailsModel = ApprovalRequests.Select(ar =>
                {
                    var employeeId = _context.LeaveRequests
                        .Where(lr => lr.Id == ar.LeaveRequestId)
                        .Select(lr => lr.EmployeeId)
                        .FirstOrDefault();

                    var employee = _context.Employees
                        .Where(e => e.Id == employeeId)
                        .Select(e => new { e.Name, e.Surname })
                        .FirstOrDefault();

                    return new approvalRequestDetailsModel
                    {
                        Id = ar.Id,
                        ApproverId = ar.ApproverId,
                        LeaveRequestId = ar.LeaveRequestId,
                        Status = ar.Status,
                        Comment = ar.Comment,
                        EmployeeId = employeeId,
                        Name = employee.Name,
                        Surname = employee.Surname,
                        StartDate = _context.LeaveRequests
                            .Where(lr => lr.Id == ar.LeaveRequestId)
                            .Select(lr => lr.StartDate)
                            .FirstOrDefault(),
                        EndDate = _context.LeaveRequests
                            .Where(lr => lr.Id == ar.LeaveRequestId)
                            .Select(lr => lr.EndDate)
                            .FirstOrDefault(),
                    };
                }).ToList();


                return Ok(approvalRequestDetailsModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Download Error: {ex.Message}");
            }
        }

    }
}