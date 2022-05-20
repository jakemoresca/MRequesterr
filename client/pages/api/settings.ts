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

    return settings.default;
}
