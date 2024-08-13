using Microsoft.AspNetCore.Mvc;
using OutOfOffice.Server.Models.SQLmodels;

namespace OutOfOffice.Server.Models.Input
{
    public class updateApprovalRequestModelInput
    {
        public int id { get; set; }
        public RequestStatus status { get; set; }
        public string? comment { get; set; }
    }


}
