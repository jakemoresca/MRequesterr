import { IMedia } from "../models/media";
import { ISettings } from "../models/settings";
import { getSettings } from "./settings";

export async function sendDiscordRequestMessage(media: IMedia, overrideSettings?: ISettings) {
    const settings = overrideSettings ?? await getSettings();

    const discordRequestBody = {
        content: `Hello! Your request for ${media.title} has been approved`,
        author: "MRequesterr",
        embeds: [
            {
                title: media.title,
                description: media.overview,
                color: 5814783,
                image: {
                    url: media.images[0].url
                }
            }]
    }

    const result = await fetch(settings.integrationSettings.discordWebhookUrl, {
        method: 'POST',
        body: JSON.stringify(discordRequestBody),
        headers: {
            'content-type': 'application/json'
        }
    });

    if (result.ok) {
        return true;
    }

    // return media;
}