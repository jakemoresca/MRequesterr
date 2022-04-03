using MRequesterr.DTOs;
using MRequesterr.Models;

namespace MRequesterr.Services
{
    public interface ISonarrService
    {
        Task<bool> IsSettingsValid(SeriesSettings seriesSettings);
        Task<List<MediaDto>> GetSeries();
    }
}