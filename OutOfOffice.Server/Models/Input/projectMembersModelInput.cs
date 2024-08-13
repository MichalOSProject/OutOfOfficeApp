using Microsoft.AspNetCore.Mvc;

namespace OutOfOffice.Server.Models.Input
{
    public class projectMembersModelInput
    {
        public int projID { get; set; }
        public int[] members { get; set; }
    }

}