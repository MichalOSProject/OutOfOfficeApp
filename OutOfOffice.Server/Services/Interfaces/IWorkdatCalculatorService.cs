namespace OutOfOffice.Server.Services.Interfaces
{
    public interface IWorkdayCalculatorService
    {
        Task<int> CalculateWorkdaysAsync(DateOnly startDate, DateOnly endDate);
    }
}
