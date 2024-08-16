using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models.Input;
using OutOfOffice.Server.Models.Output;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;

        public EmployeeController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [HttpPost("add")]
        [Authorize(Policy = "HRPosition")]
        public async Task<ActionResult<Employee>> AddEmployee([FromBody] userModelInput requestData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Data");
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

            if (requestData.Position.Equals("Boss", StringComparison.OrdinalIgnoreCase) && !isAdmin)
            {
                return BadRequest("Only Administrator's account can create another Administrator");
            }

            string hrPosition = _context.Employees.Where(emplo => emplo.Id.Equals(requestData.EmployeePartner)).Select(emplo => emplo.Position).FirstOrDefault();

            if (!hrPosition.Equals("HR", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Employee Partner must have HR Position");
            }

            var newEmployee = _mapper.Map<Employee>(requestData);
            var newLogin = _mapper.Map<registerUserModelInput>(requestData);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.Employees.Add(newEmployee);
                await _context.SaveChangesAsync();

                var user = new ApplicationUser
                {
                    UserName = newLogin.Login,
                    changePassword = newLogin.changePassword,
                    EmployeeId = newEmployee.Id

                };

                var result = await _userManager.CreateAsync(user, newLogin.Password);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    return BadRequest(string.Join("\n", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).Where(error => !string.IsNullOrWhiteSpace(error))));
                }

                await _signInManager.SignInAsync(user, isPersistent: false);
                await transaction.CommitAsync();

                return Ok(newEmployee.Id);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return UnprocessableEntity("Internal server error");
            }
        }


        [HttpPost("edit")]
        [Authorize(Policy = "HRPosition")]
        public async Task<ActionResult<Employee>> editEmployee([FromBody] Employee requestData)
        {
            if (requestData == null)
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

            var employees = _context.Employees.FirstOrDefault(item => item.Id == requestData.Id);

            if (employees == null)
            {
                return BadRequest("The Employee does not exist");
            }

            if (!employees.EmployeePartner.Equals(idFromJWT) && !isAdmin)
            {
                return BadRequest("You are not the proper HR Manager");
            }

            if (requestData.Position.Equals("Boss", StringComparison.OrdinalIgnoreCase) && !employees.Position.Equals("Boss", StringComparison.OrdinalIgnoreCase) && !isAdmin)
            {
                return BadRequest("Only Administrator's account can upgrade another account to Administrator role");
            }

            if (employees.Position.Equals("Boss", StringComparison.OrdinalIgnoreCase) && !requestData.Position.Equals("Boss", StringComparison.OrdinalIgnoreCase) && !isAdmin)
            {
                return BadRequest("Only Administrator's account can change another Administrator account role");
            }

            string hrPosition = _context.Employees.Where(emplo => emplo.Id.Equals(requestData.EmployeePartner)).Select(emplo => emplo.Position).FirstOrDefault();

            if (!hrPosition.Equals("HR", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Employee Partner must have HR Position");
            }

            employees.Name = requestData.Name;
            employees.Surname = requestData.Surname;
            employees.Subdivision = requestData.Subdivision;
            employees.Position = requestData.Position;
            employees.EmployeeStatus = requestData.EmployeeStatus;
            employees.EmployeePartner = requestData.EmployeePartner;
            employees.FreeDays = requestData.FreeDays;
            employees.Photo = requestData.Photo;

            if (!requestData.EmployeeStatus) {
                var tokens = _context.JwtTokens
                        .Where(x => x.UserId.Equals(employees.Id))
                        .ToList();
                foreach (var token in tokens)
                {
                    token.Enabled = false;
                }
            }

            await _context.SaveChangesAsync();

            return Ok("Employee modified successfully");
        }

        [HttpGet]
        [Authorize(Policy = "HighPosition")]
        public async Task<ActionResult<IEnumerable<employeeModelOutput>>> GetEmployees()
        {
            try
            {
                var employees = _context.Employees
                    .Select(emplo =>
                        new employeeModelOutput
                        {
                            Id = emplo.Id,
                            Name = emplo.Name,
                            Surname = emplo.Surname,
                            Subdivision = emplo.Subdivision,
                            Position = emplo.Position,
                            EmployeeStatus = emplo.EmployeeStatus,
                            EmployeePartner = _context.Employees
                                                        .Where(hr => hr.Id == emplo.EmployeePartner && hr.Position.Equals("HR"))
                                                        .Select(hr => hr.Name + " " + hr.Surname)
                                                        .FirstOrDefault() ?? "Required action",
                            EmployeePartnerID = emplo.EmployeePartner,
                            FreeDays = emplo.FreeDays,
                            Photo = emplo.Photo
                        }
                    ).ToList();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

        [Authorize(Policy = "HighPosition")]
        [HttpGet("HRs")]
        public async Task<ActionResult<IEnumerable<hrsModelOutput>>> GetHRs()
        {
            try
            {
                var employees = _context.Employees
                    .Where(emplo => emplo.Position.Equals("HR"))
                    .Select(emplo =>
                   new hrsModelOutput
                   {
                       Id = emplo.Id,
                       Name = emplo.Name + " " + emplo.Surname,
                       Status = emplo.EmployeeStatus
                   })
                    .ToList();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

        [Authorize(Policy = "HighPosition")]
        [HttpGet("PMs")]
        public async Task<ActionResult<IEnumerable<pmsModelOutput>>> GetPMs()
        {
            try
            {
                var employees = _context.Employees
                    .Where(emplo => emplo.Position.Equals("Project Manager"))
                    .Select(emplo =>
                   new pmsModelOutput
                   {
                       Id = emplo.Id,
                       Name = emplo.Name + " " + emplo.Surname,
                       Status = emplo.EmployeeStatus
                   })
                    .ToList();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

    }
}