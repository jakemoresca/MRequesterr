import { ISettings } from '../models/settings'

export async function getSettings(): Promise<ISettings> {
    const settings = await import("../datas/settings.json");

    settings.integrationSettings.movies.apiKey = process.env.RADARR_API_KEY ?? settings.integrationSettings.movies.apiKey;
    settings.integrationSettings.series.apiKey = process.env.SONARR_API_KEY ?? settings.integrationSettings.series.apiKey;
    settings.integrationSettings.auth.apiKey = process.env.JELLYFIN_API_KEY ?? settings.integrationSettings.auth.apiKey;
    settings.integrationSettings.discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL ?? settings.integrationSettings.discordWebhookUrl;

    return settings.default;
}
