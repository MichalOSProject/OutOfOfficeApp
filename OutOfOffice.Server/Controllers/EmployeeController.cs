using AutoMapper;
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
        public async Task<ActionResult<Employee>> AddEmployee([FromBody] userModelInput requestData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
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
                    return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
                }

                await _signInManager.SignInAsync(user, isPersistent: false);
                await transaction.CommitAsync();

                return Ok("Registration successful");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return UnprocessableEntity("Internal server error");
            }
        }


        [HttpPost("edit")]
        public async Task<ActionResult<Employee>> editEmployee([FromBody] Employee requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            var employees = _context.Employees.FirstOrDefault(item => item.Id == requestData.Id);
            if (employees == null)
            {
                return BadRequest("The Employee does not exist");
            }

            employees.Name = requestData.Name;
            employees.Surname = requestData.Surname;
            employees.Subdivision = requestData.Subdivision;
            employees.Position = requestData.Position;
            employees.EmployeeStatus = requestData.EmployeeStatus;
            employees.EmployeePartner = requestData.EmployeePartner;
            employees.FreeDays = requestData.FreeDays;
            employees.Photo = requestData.Photo;

            await _context.SaveChangesAsync();

            return Ok("Employee modified successfully");
        }

        [HttpGet]
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
                                                        .Where(hr => hr.Id == emplo.EmployeePartner)
                                                        .Select(hr => hr.Name + " " + hr.Surname)
                                                        .First(),
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