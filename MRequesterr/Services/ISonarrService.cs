using MRequesterr.Models;

namespace MRequesterr.Services
{
    public interface ISonarrService
    {
        Task<bool> IsSettingsValid(SeriesSettings seriesSettings);
    }
}