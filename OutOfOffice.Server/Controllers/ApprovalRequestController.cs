using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OutOfOffice.Server.Models.Input;
using OutOfOffice.Server.Models.Output;
using OutOfOffice.Server.Models.SQLmodels;
using OutOfOffice.Server.Services.Interfaces;
using System.Collections.Immutable;
using System.ComponentModel.DataAnnotations;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApprovalRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWorkdayCalculatorService _workdayCalculatorService;

        public ApprovalRequestController(ApplicationDbContext context, IWorkdayCalculatorService workdayCalculatorService)
        {
            _context = context;
            _workdayCalculatorService = workdayCalculatorService;
        }

        [Authorize(Policy = "HighPosition")]
        [HttpPost("edit")]
        public async Task<ActionResult<ApprovalRequest>> updateApprovalRequest([FromBody] updateApprovalRequestModelInput requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }
            if (requestData.status == RequestStatus.New)
            {
                return BadRequest("Status not updated");
            }

            string jtiKey = User.FindFirst("Jti")?.Value;

            int idFromJWT = _context.JwtTokens
                .Where(token => token.Jti.Equals(jtiKey))
                .Select(token => token.UserId)
                .FirstOrDefault();

            bool isAdmin = _context.JwtTokens
                .Where(token => token.Jti.Equals(jtiKey))
                .Select(token => token.Position)
                .FirstOrDefault().Equals("Boss", StringComparison.OrdinalIgnoreCase) ? true : false;

            var ApprovalRequests = _context.ApprovalRequests.FirstOrDefault(item => item.Id == requestData.id);

            if (!ApprovalRequests.ApproverId.Equals(idFromJWT) && !isAdmin)
            {
                return BadRequest("You are not the proper approver");
            }

            if (ApprovalRequests == null)
            {
                return BadRequest("The Approval Request does not exist");
            }
            if (ApprovalRequests.Status != 0)
            {
                return BadRequest("The Approval Request cannot be updated, request has been resolved");
            }

            ApprovalRequests.Status = requestData.status;
            ApprovalRequests.Comment = requestData.comment;

            await _context.SaveChangesAsync();

            var leaveRequest = await _context.LeaveRequests
                    .Where(lr => lr.Id == ApprovalRequests.LeaveRequestId)
                    .FirstOrDefaultAsync();

            if (leaveRequest.RequestStatus == LeaveRequestStatus.New)
            {
                if (requestData.status == RequestStatus.Rejected)
                {
                    var employee = await _context.Employees
                            .Where(emplo => emplo.Id == leaveRequest.EmployeeId)
                            .FirstOrDefaultAsync();

                    leaveRequest.RequestStatus = LeaveRequestStatus.Rejected;
                    employee.FreeDays += await _workdayCalculatorService.CalculateWorkdaysAsync(leaveRequest.StartDate, leaveRequest.EndDate);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var approveRequests = await _context.ApprovalRequests
                        .Where(item => item.LeaveRequestId == leaveRequest.Id)
                        .Select(item => item.Status).
                        ToArrayAsync();

                    foreach (RequestStatus approveStatus in approveRequests)
                    {
                        if (approveStatus != RequestStatus.Approved)
                            return Ok("Approval Request updated successfully");
                    }

                    leaveRequest.RequestStatus = LeaveRequestStatus.Approved;
                    await _context.SaveChangesAsync();
                    return Ok("Approval Request updated successfully, Leave request has been closed");


                }
            }

            return Ok("Approval Request updated successfully");
        }

        [Authorize]
        [HttpPost("approveStatus")]
        public async Task<ActionResult<approvalRequestDetailsModelOutput>> getApproveStatus([FromBody] int leaveRequestID)
        {
            if (leaveRequestID == null)
            {
                return BadRequest("Invalid data.");
            }

            string jtiKey = User.FindFirst("Jti")?.Value;

            int idFromJWT = _context.JwtTokens
                .Where(token => token.Jti.Equals(jtiKey))
                .Select(token => token.UserId)
                .FirstOrDefault();

            bool isAdmin = _context.JwtTokens
                .Where(token => token.Jti.Equals(jtiKey))
                .Select(token => token.Position)
                .FirstOrDefault().Equals("Boss", StringComparison.OrdinalIgnoreCase) ? true : false;

            var LR = _context.LeaveRequests
                .Where(item => item.Id.Equals(leaveRequestID))
                .FirstOrDefault();

            if (!LR.EmployeeId.Equals(idFromJWT) && !isAdmin)
            {
                return BadRequest("You are not the proper approver");
            }

            var ApprovalRequests = await _context.ApprovalRequests.ToListAsync();

            var approverRequestsList = ApprovalRequests
                .Where(item => item.LeaveRequestId == leaveRequestID)
                .Select(ar =>
            {
                return new approvalRequestDetailsModelOutput
                {
                    Id = ar.Id,
                    Approver = _context.Employees
                        .Where(emplo => emplo.Id == ar.ApproverId)
                        .Select(emplo => emplo.Name + " " + emplo.Surname)
                        .FirstOrDefault(),
                    Status = ar.Status,
                    Comment = ar.Comment
                };
            }).ToList();

            if (approverRequestsList is null or [])
            {
                return BadRequest("No Approval request found with ID {leaveRequestID}.");
            }

            return Ok(approverRequestsList);
        }

        [Authorize(Policy = "HighPosition")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApprovalRequest>>> GetApproveRequests()
        {
            try
            {
                string jtiKey = User.FindFirst("Jti")?.Value;

                int idFromJWT = _context.JwtTokens
                    .Where(token => token.Jti.Equals(jtiKey))
                    .Select(token => token.UserId)
                    .FirstOrDefault();

                bool isAdmin = _context.JwtTokens
                    .Where(token => token.Jti.Equals(jtiKey))
                    .Select(token => token.Position)
                    .FirstOrDefault().Equals("Boss", StringComparison.OrdinalIgnoreCase) ? true : false;

                var ApprovalRequests = new List<ApprovalRequest>();
                if (isAdmin)
                {
                    ApprovalRequests = await _context.ApprovalRequests.ToListAsync();
                }
                else
                {
                    ApprovalRequests = await _context.ApprovalRequests.Where(item => item.ApproverId.Equals(idFromJWT)).ToListAsync();
                }

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

                    return new approvalRequestExtendedModelOutput
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
                return BadRequest("Invalid Request");
            }
        }

    }
}