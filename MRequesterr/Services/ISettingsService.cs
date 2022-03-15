using MRequesterr.Models;

namespace MRequesterr.Services
{
    public interface ISettingsService
    {
        ValidationMessage Update(IntegrationOptions model);
        IntegrationOptions GetSettings();
    }
}