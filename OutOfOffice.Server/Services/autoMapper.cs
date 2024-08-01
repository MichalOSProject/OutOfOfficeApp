using AutoMapper;
using OutOfOffice.Server.Models;
using OutOfOffice.Server.Models.SQLmodels;
using static OutOfOffice.Server.Controllers.EmployeeController;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<newUser, Employee>();
        CreateMap<newUser, registerUser>();
        CreateMap<newProject, Project>();
    }
}
