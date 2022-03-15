using Microsoft.Extensions.Options;
using MRequesterr.Models;
using MRequesterr.Repositories;

namespace MRequesterr.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly IOptionsSnapshot<IntegrationOptions> _integrationOptions;

        public SettingsService(IOptionsSnapshot<IntegrationOptions> integrationOptions)
        {
            _integrationOptions = integrationOptions;
        }

        public IntegrationOptions GetSettings()
        {
            return _integrationOptions.Value;
        }

        public ValidationMessage Update(IntegrationOptions model)
        {
            model.MovieSettings.BaseUrl = model.MovieSettings.BaseUrl?.Trim();

            if (!string.IsNullOrWhiteSpace(model.MovieSettings.BaseUrl) && !model.MovieSettings.BaseUrl.StartsWith("/"))
            {
                return new ValidationMessage("Base urls must start with /", true);
            }

            SettingsRepository.Write(model);

            return new ValidationMessage("OK");
        }
    }
}
