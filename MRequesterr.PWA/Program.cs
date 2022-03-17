using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using MRequesterr.Models;
using MRequesterr.PWA;
using MRequesterr.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IRadarrService, RadarrService>();
builder.Services.AddScoped<ISonarrService, SonarrService>();

//builder.Configuration.AddJsonFile("integrationSettings.json", optional: true, reloadOnChange: true);
//    .AddJsonFile($"appsettings.json", true, true);

//var integrationOptions = builder.Configuration.GetValue<IntegrationOptions>(IntegrationOptions.IntegrationOptionsKey);

var http = new HttpClient()
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
};

builder.Services.AddScoped(sp => http);

using var response = await http.GetAsync("integrationSettings.json");
using var stream = await response.Content.ReadAsStreamAsync();

builder.Configuration.AddJsonStream(stream);

builder.Services.AddScoped<IntegrationOptions>((provider) =>
{
    return builder.Configuration.GetSection("IntegrationOptions").Get<IntegrationOptions>();
});

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync();
