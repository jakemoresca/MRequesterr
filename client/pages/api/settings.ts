// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ISettings } from '../../models/settings'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISettings>
) {
    const settings = await getSettings();
    res.status(200).json(settings)
}

export async function getSettings(): Promise<ISettings> {
    const settings = await import("../../datas/settings.json");

    settings.integrationSettings.movies.apiKey = process.env.RADARR_API_KEY ?? settings.integrationSettings.movies.apiKey;
    settings.integrationSettings.series.apiKey = process.env.SONARR_API_KEY ?? settings.integrationSettings.series.apiKey;
    settings.integrationSettings.auth.apiKey = process.env.JELLYFIN_API_KEY ?? settings.integrationSettings.auth.apiKey;

    return settings.default;
}
