﻿using Microsoft.AspNetCore.Mvc;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Models
{
    public class resetPasswordModel
    {
        public string login { get; set; }
        public string Password { get; set; }
        public string newPassword { get; set; }
    }
}
