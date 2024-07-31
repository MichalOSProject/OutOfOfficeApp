using Microsoft.AspNetCore.Mvc;

namespace OutOfOffice.Server.Models
{
    public class addProjectMembersModel
    {
        public int projID { get; set; }
        public int[] members { get; set; }
    }

}