using Microsoft.AspNetCore.Mvc;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Models.Input
{
    public class logonModelInput
    {
        public string login { get; set; }
        public string Password { get; set; }
    }
}
