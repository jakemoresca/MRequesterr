using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using MRequesterr.Models;
using MRequesterr.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var mvcBuilder = builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSingleton<WeatherForecastService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IRadarrService, RadarrService>();
builder.Services.AddScoped<ISonarrService, SonarrService>();

builder.Configuration.AddJsonFile("integrationSettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.json", true, true);

builder.Services.Configure<IntegrationOptions>(
    builder.Configuration.GetSection(IntegrationOptions.IntegrationOptionsKey));

builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    mvcBuilder.AddRazorRuntimeCompilation();

    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
