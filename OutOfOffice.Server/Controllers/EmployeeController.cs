using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models;
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
        public async Task<ActionResult<Employee>> AddEmployee([FromBody] newUser requestData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            var newEmployee = _mapper.Map<Employee>(requestData);
            var newLogin = _mapper.Map<registerUser>(requestData);

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
                return StatusCode(500, $"Internal server error: {ex.Message}");
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
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Download Error: {ex.Message}");
            }
        }

    }
}