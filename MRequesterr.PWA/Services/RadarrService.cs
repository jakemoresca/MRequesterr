using Microsoft.Extensions.Options;
using MRequesterr.DTOs;
using MRequesterr.Models;
using System.Text.Json;

namespace MRequesterr.Services
{
    public class RadarrService : IRadarrService
    {
        private readonly HttpClient _httpClient;
        private readonly IntegrationOptions _settingsOptions;

        public RadarrService(HttpClient httpClient, ISettingsService settingsService)
        {
            _httpClient = httpClient;
            _settingsOptions = settingsService.GetSettings();
        }

        public async Task<List<MediaDto>> GetMovies()
        {
            var getMovieUrl = new Uri(GetServiceUrl(_settingsOptions.MovieSettings, "/movie"));
            var request = new HttpRequestMessage(HttpMethod.Get, getMovieUrl);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var moviesJson = await response.Content.ReadAsStreamAsync();

                var options = new JsonSerializerOptions();
                options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

                var result = await JsonSerializer.DeserializeAsync<List<MediaDto>>(moviesJson, options);

                return result ?? new List<MediaDto>();
            }
            else
            {
                return new List<MediaDto>();
            }
        }

        public async Task<MediaDto> GetMovie(int movieId)
        {
            var getMovieUrl = new Uri(GetServiceUrl(_settingsOptions.MovieSettings, $"/movie/{movieId}"));
            var request = new HttpRequestMessage(HttpMethod.Get, getMovieUrl);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var moviesJson = await response.Content.ReadAsStreamAsync();

                var options = new JsonSerializerOptions();
                options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

                var result = await JsonSerializer.DeserializeAsync<MediaDto>(moviesJson, options);

                return result ?? new MediaDto { };
            }
            else
            {
                return new MediaDto { };
            }
        }

        public async Task<bool> IsSettingsValid(MovieSettings movieSettings)
        {
            try
            {
                var getMovieUrl = new Uri(GetServiceUrl(movieSettings, "/system/status"));
                var request = new HttpRequestMessage(HttpMethod.Get, getMovieUrl);

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var resultStream = await response.Content.ReadAsStreamAsync();

                    var options = new JsonSerializerOptions();
                    options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

                    var radarrTestDto = await JsonSerializer.DeserializeAsync<RadarrTestDto>(resultStream, options);

                    return radarrTestDto != null && radarrTestDto.AppName == "Radarr";
                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string GetServiceUrl(MovieSettings integrationSettings, string relativeServiceUrl)
        {
            var apiKey = integrationSettings.ApiKey;
            var port = integrationSettings.Port;
            var host = integrationSettings.Host;
            var useSsl = integrationSettings.UseSsl;
            var baseUrl = integrationSettings.BaseUrl;
            var protocol = useSsl ? "https://" : "http://";

            var serviceUrl = $"{protocol}{host}:{port}{baseUrl}/api/v3{relativeServiceUrl}?apiKey={apiKey}";

            return serviceUrl;
        }
    }
}
