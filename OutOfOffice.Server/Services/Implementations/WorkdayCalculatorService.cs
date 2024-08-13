using Nager.Holiday;
using OutOfOffice.Server.Services.Interfaces;

namespace OutOfOffice.Server.Services.Implementations
{
    public class WorkdayCalculatorService : IWorkdayCalculatorService
    {
        private readonly HolidayClient _holidayClient;

        public WorkdayCalculatorService(HolidayClient holidayClient)
        {
            _holidayClient = holidayClient;
        }

        public async Task<int> CalculateWorkdaysAsync(DateOnly startDate, DateOnly endDate)
        {
            int workdays = 0;

            var holidaysStartYear = await _holidayClient.GetHolidaysAsync(startDate.Year, "pl");
            var holidaysEndYear = await _holidayClient.GetHolidaysAsync(endDate.Year, "pl");

            var holidays = holidaysStartYear.Concat(holidaysEndYear)
                                            .Select(h => DateOnly.FromDateTime(h.Date))
                                            .ToHashSet();

            for (DateOnly date = startDate; date <= endDate; date = date.AddDays(1))
            {
                if (date.DayOfWeek != DayOfWeek.Saturday &&
                    date.DayOfWeek != DayOfWeek.Sunday &&
                    !holidays.Contains(date))
                {
                    workdays++;
                }
            }

            return workdays;
        }
    }
}
