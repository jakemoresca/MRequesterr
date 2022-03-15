using MRequesterr.DTOs;
using MRequesterr.Models;

namespace MRequesterr.Services
{
    public interface IRadarrService
    {
        Task<bool> IsSettingsValid(MovieSettings movieSettings);
        Task<List<MovieDto>> GetMovies();
        Task<MovieDto> GetMovie(int movieId);
    }
}