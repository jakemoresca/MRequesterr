using Microsoft.Extensions.Options;
using MRequesterr.DTOs;
using MRequesterr.Models;
using System.Text.Json;

namespace MRequesterr.Services
{
    public class RadarrService : IRadarrService
    {
        private readonly HttpClient _httpClient;
        private readonly IOptionsSnapshot<IntegrationOptions> _settingsOptions;

        public RadarrService(IHttpClientFactory httpClientFactory, IOptionsSnapshot<IntegrationOptions> settingsOptions)
        {
            _httpClient = httpClientFactory.CreateClient();
            _settingsOptions = settingsOptions;
        }

        public async Task<List<MovieDto>> GetMovies()
        {
            var getMovieUrl = new Uri(GetServiceUrl(_settingsOptions.Value.MovieSettings, "/movie"));
            var request = new HttpRequestMessage(HttpMethod.Get, getMovieUrl);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var moviesJson = await response.Content.ReadAsStreamAsync();

                var options = new JsonSerializerOptions();
                options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

                var result = await JsonSerializer.DeserializeAsync<List<MovieDto>>(moviesJson, options);

                return result ?? new List<MovieDto>();
            }
            else
            {
                return new List<MovieDto>();
            }
        }

        public async Task<MovieDto> GetMovie(int movieId)
        {
            var getMovieUrl = new Uri(GetServiceUrl(_settingsOptions.Value.MovieSettings, $"/movie/{movieId}"));
            var request = new HttpRequestMessage(HttpMethod.Get, getMovieUrl);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var moviesJson = await response.Content.ReadAsStreamAsync();

                var options = new JsonSerializerOptions();
                options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

                var result = await JsonSerializer.DeserializeAsync<MovieDto>(moviesJson, options);

                return result ?? new MovieDto { };
            }
            else
            {
                return new MovieDto { };
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
