using MRequesterr.DTOs;
using MRequesterr.Models;
using System.Text.Json;

namespace MRequesterr.Services
{
    public class SonarrService : ISonarrService
    {
        private readonly HttpClient _httpClient;

        public SonarrService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> IsSettingsValid(SeriesSettings seriesSettings)
        {
            try
            {
                var getMovieUrl = new Uri(GetServiceUrl(seriesSettings, "/system/status"));
                var request = new HttpRequestMessage(HttpMethod.Get, getMovieUrl);

                var response = await _httpClient.SendAsync(request);

                if(response.IsSuccessStatusCode)
                {
                    var resultStream = await response.Content.ReadAsStreamAsync();

                    var options = new JsonSerializerOptions();
                    options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

                    var sonarrTestDto = await JsonSerializer.DeserializeAsync<SonarrTestDto>(resultStream, options);

                    return sonarrTestDto != null && sonarrTestDto.AppName == "Sonarr";
                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string GetServiceUrl(SeriesSettings integrationSettings, string relativeServiceUrl)
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
