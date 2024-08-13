using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutOfOffice.Server.Models.Input;
using OutOfOffice.Server.Models.Output;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProjectController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("add")]
        public async Task<ActionResult<Project>> addProject([FromBody] projectModelInput requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            var newProject = _mapper.Map<Project>(requestData);

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            if (requestData.members == null)
            {
                return Ok("Project added successfully without members");
            }

            foreach (int idMember in requestData.members)
            {
                var newProjectMember = new ProjectDetails
                {
                    projectId = newProject.Id,
                    employeeId = idMember
                };
                _context.ProjectsDetails.Add(newProjectMember);
            }
            await _context.SaveChangesAsync();

            return Ok("Project added successfully with members.");
        }

        [HttpPost("edit")]
        public async Task<ActionResult<Project>> editProject([FromBody] Project requestData)
        {
            if (requestData == null)
            {
                return BadRequest("Invalid data.");
            }

            var projects = _context.Projects.FirstOrDefault(item => item.Id == requestData.Id);
            if (projects == null)
            {
                return BadRequest("The Project does not exist");
            }
            projects.ProjectType = requestData.ProjectType;
            projects.StartDate = requestData.StartDate;
            projects.EndDate = requestData.EndDate;
            projects.ManagerId = requestData.ManagerId;
            projects.Comment = requestData.Comment;
            projects.ProjectStatus = requestData.ProjectStatus;

            await _context.SaveChangesAsync();

            return Ok("Project added successfully");
        }

        [HttpPost("projectsMembers")]
        public async Task<IActionResult> editProjectMembers([FromBody] int projID)
        {
            try
            {
                var idsProjMembers = await _context.ProjectsDetails
                    .Where(item => item.projectId == projID)
                    .Select(item => item.employeeId)
                    .ToArrayAsync();

                if (idsProjMembers == null)
                {
                    return Ok(null);
                }

                var projMembers = await _context.Employees
                    .Where(item => idsProjMembers.Contains(item.Id))
                    .ToArrayAsync();
                return Ok(projMembers);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

        [HttpPost("addProjectsMembers")]
        public async Task<IActionResult> addProjectMembers([FromBody] projectMembersModelInput requestData)
        {
            try
            {
                if (requestData == null)
                {
                    return BadRequest("No data to process");
                }
                var projectCurrentMembers = await _context.ProjectsDetails
                    .Where(item => item.projectId == requestData.projID)
                    .Select(item => item.employeeId)
                    .ToListAsync();

                foreach (int idMember in requestData.members)
                {
                    if (!projectCurrentMembers.Contains(idMember) || projectCurrentMembers == null)
                    {
                        var newProjectMember = new ProjectDetails
                        {
                            projectId = requestData.projID,
                            employeeId = idMember
                        };
                        _context.ProjectsDetails.Add(newProjectMember);
                    }
                }
                await _context.SaveChangesAsync();

                return Ok("Members added successfully.");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

        [HttpPost("deleteProjectsMembers")]
        public async Task<IActionResult> deleteProjectMembers([FromBody] projectMembersModelInput requestData)
        {
            try
            {
                if (requestData == null)
                {
                    return BadRequest("No data to process");
                }
                var projectCurrentMembers = await _context.ProjectsDetails
                    .Where(item => item.projectId == requestData.projID)
                    .Select(item => item.employeeId)
                    .ToListAsync();

                if (projectCurrentMembers == null)
                {
                    return Ok("No members in this Project to process");
                }

                foreach (int idMember in requestData.members)
                {
                    if (projectCurrentMembers.Contains(idMember))
                    {
                        var memberToRemove = await _context.ProjectsDetails
                            .Where(item => item.projectId == requestData.projID && item.employeeId == idMember)
                            .FirstOrDefaultAsync();

                        if (memberToRemove != null)
                            _context.ProjectsDetails.Remove(memberToRemove);
                    }
                }
                await _context.SaveChangesAsync();

                return Ok("Members removed successfully.");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<projectModelOutput>>> GetProjects()
        {
            try
            {
                var projects = _context.Projects
                    .Select(proj => new projectModelOutput
                    {
                        Id = proj.Id,
                        ProjectType = proj.ProjectType,
                        StartDate = proj.StartDate,
                        EndDate = proj.EndDate,
                        Manager = _context.Employees
                                    .Where(emplo => emplo.Id == proj.ManagerId)
                                    .Select(emplo => emplo.Name + " " + emplo.Surname)
                                    .First(),
                        ManagerId = proj.ManagerId,
                        Comment = proj.Comment,
                        ProjectStatus = proj.ProjectStatus
                    }).ToList();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity("Internal server error");
            }
        }
    }
}