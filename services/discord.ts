// export async function sendDiscordRequestMessage() {
//     const settings = overrideSettings ?? await getSettings();

//     const apikey = settings.integrationSettings.movies.apiKey;
//     const rootFolderPath = (await getRootFolder(settings))[0];

//     const movieRequestBody: IRadarrMovie = {
//         ...media,
//         qualityProfileId: 1,
//         apikey,
//         monitored: true,
//         rootFolderPath: rootFolderPath.path,
//         addOptions: { searchForMovie: true }
//     }

//     var discordWebhookUrl = 

//     const result = await fetch(requestMovieUrl, {
//         method: 'POST',
//         body: JSON.stringify(movieRequestBody),
//         headers: {
//             'content-type': 'application/json'
//         }
//     });

//     if (result.ok) {
//         return result.json();
//     }

//     // return media;
// }

export function test() {
    
}