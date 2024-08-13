using AutoMapper;
using OutOfOffice.Server.Models.Input;
using OutOfOffice.Server.Models.SQLmodels;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<userModelInput, Employee>();
        CreateMap<userModelInput, registerUserModelInput>();
        CreateMap<projectModelInput, Project>();
    }
}
