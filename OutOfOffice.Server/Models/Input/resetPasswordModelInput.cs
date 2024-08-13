using Microsoft.AspNetCore.Mvc;

namespace OutOfOffice.Server.Models.Input
{
    public class resetPasswordModelInput
    {
        public string login { get; set; }
        public string Password { get; set; }
        public string newPassword { get; set; }
    }
}
