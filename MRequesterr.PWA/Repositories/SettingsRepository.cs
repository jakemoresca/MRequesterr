using MRequesterr.Models;
using System.Text.Json;

namespace MRequesterr.Repositories
{
    public class SettingsRepository
    {
        private static object _lock = new object();

        public const string FilePath = "integrationSettings.json";

        public static void Write(IntegrationOptions settings)
        {
            lock (_lock)
            {
                var integrationSettingsFile = new IntegrationSettingsFile
                {
                    IntegrationOptions = settings
                };

                File.WriteAllText(FilePath, JsonSerializer.Serialize(integrationSettingsFile));
            }
        }

        internal class IntegrationSettingsFile
        {
            public IntegrationOptions IntegrationOptions { get; set; }
        }
    }
}
