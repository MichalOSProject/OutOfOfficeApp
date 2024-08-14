using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nager.Holiday;
using OutOfOffice.Server.Models.Output;
using OutOfOffice.Server.Models.SQLmodels;
using OutOfOffice.Server.Services.Interfaces;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWorkdayCalculatorService _workdayCalculatorService;

        public LeaveRequestController(ApplicationDbContext context, IWorkdayCalculatorService workdayCalculatorService)
        {
            _context = context;
            _workdayCalculatorService = workdayCalculatorService;
        }

        [HttpPost("add")]
        public async Task<ActionResult<LeaveRequest>> addLeaveRequest([FromBody] LeaveRequest requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            if (requestData.StartDate > requestData.EndDate)
            {
                return BadRequest("The start date must be before the end date.");
            }

            var employee = await _context.Employees
                                    .Where(emplo => emplo.Id == requestData.EmployeeId)
                                    .FirstOrDefaultAsync();
            if (employee == null)
                return BadRequest("Invalid Employee ID.");

            int workdays = await _workdayCalculatorService.CalculateWorkdaysAsync(requestData.StartDate, requestData.EndDate);

            if (employee.FreeDays < workdays)
                return BadRequest("Request was not created, avaliable free days: " + employee.FreeDays + ", request tried to use: " + workdays + ".");

            _context.LeaveRequests.Add(requestData);
            employee.FreeDays -= workdays;
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

            return Ok(requestData.Id);
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

            return Ok("Leave Request added successfully");
        }

        [HttpPost("cancel")]
        public async Task<ActionResult<LeaveRequest>> cancelLeaveRequest([FromBody] int requestID)
        {
            LeaveRequest LR = await _context.LeaveRequests
                .Where(item => item.Id == requestID)
                .FirstAsync();

            if (LR.RequestStatus.Equals(LeaveRequestStatus.Cancelled))
            {
                return BadRequest("Leave Request is already cancelled");
            }

            var employee = await _context.Employees
                                    .Where(emplo => emplo.Id == LR.EmployeeId)
                                    .FirstOrDefaultAsync();

            if (LR.RequestStatus.Equals(LeaveRequestStatus.Approved))
            {
                var startDate = LR.StartDate;
                if (LR.StartDate <= DateOnly.FromDateTime(DateTime.Now))
                    startDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1);

                if (LR.EndDate > DateOnly.FromDateTime(DateTime.Now) && LR.EndDate >= startDate)
                {
                    employee.FreeDays += await _workdayCalculatorService.CalculateWorkdaysAsync(startDate, LR.EndDate);
                }
            }
            else
            {
                employee.FreeDays += await _workdayCalculatorService.CalculateWorkdaysAsync(LR.StartDate, LR.EndDate);
            }

            LR.RequestStatus = LeaveRequestStatus.Cancelled;
            await _context.SaveChangesAsync();

            return Ok("Leave Request cancelled successfully");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<leaveRequestModelOutput>>> GetLeaveRequests()
        {
            try
            {
                var LeaveRequests = _context.LeaveRequests
                    .Select(LR => new leaveRequestModelOutput
                    {
                        Id = LR.Id,
                        Employee = _context.Employees
                                        .Where(emplo => emplo.Id.Equals(LR.EmployeeId))
                                        .Select(emplo => emplo.Name + " " + emplo.Surname)
                                        .First(),
                        AbsenceReason = LR.AbsenceReason,
                        StartDate = LR.StartDate,
                        EndDate = LR.EndDate,
                        Comment = LR.Comment,
                        RequestStatus = LR.RequestStatus
                    }).ToList();
                return Ok(LeaveRequests);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

    }
}