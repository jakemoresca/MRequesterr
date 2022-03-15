namespace MRequesterr.Models
{
    public class IntegrationOptions
    {
        public IntegrationOptions()
        {
            MovieSettings = new MovieSettings();
            SeriesSettings = new SeriesSettings();
        }

        public static string IntegrationOptionsKey = "IntegrationOptions";

        public MovieSettings MovieSettings { get; set; }
        public SeriesSettings SeriesSettings { get; set; }
        public string? TMdbAPIKey { get; set; }
    }

    public class MovieSettings
    {
        public string? BaseUrl { get; set; }
        public string? ApiKey { get; set; }
        public string? Host { get; set; }
        public int? Port { get; set; }
        public bool UseSsl { get; set; }
    }

    public class SeriesSettings
    {
        public string? BaseUrl { get; set; }
        public string? ApiKey { get; set; }
        public string? Host { get; set; }
        public int? Port { get; set; }
        public bool UseSsl { get; set; }
    }
}
