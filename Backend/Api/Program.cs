using KansoBoard.Api.Middleware;
using KansoBoard.Application.ApiKeys;
using KansoBoard.Application.Auth;
using KansoBoard.Application.Authorization;
using KansoBoard.Application.Boards;
using KansoBoard.Application.Cards;
using KansoBoard.Application.Columns;
using KansoBoard.Application.Invitations;
using KansoBoard.Application.Projects;
using KansoBoard.Application.ProjectUsers;
using KansoBoard.Application.Users;
using KansoBoard.Application.Webhooks;
using KansoBoard.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SQLitePCL;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Batteries_V2.Init();

var dataFolder = Path.Combine(builder.Environment.ContentRootPath, "Data");
Directory.CreateDirectory(dataFolder);

var dbPath = Path.Combine(dataFolder, "kanso.db");

builder.Services.AddDbContext<KansoDbContext>(opt =>
{
    opt.UseSqlite($"Data Source={dbPath}");
});
builder.Services.AddHttpClient();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IBoardService, BoardService>();
builder.Services.AddScoped<IColumnService, ColumnService>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectUserService, ProjectUserService>();
builder.Services.AddScoped<IInvitationService, InvitationService>();
builder.Services.AddScoped<IProjectAuthorizationService, ProjectAuthorizationService>();
builder.Services.AddScoped<IProjectContextResolver, ProjectContextResolver>();
builder.Services.AddScoped<IApiKeyService, ApiKeyService>();
builder.Services.AddScoped<IWebhookService, WebhookService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "cors_policy", policy =>
    {
        policy.WithOrigins("*")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KansoDbContext>();
    db.Database.Migrate();
}

app.UseCors("cors_policy");
app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuthentication();
app.UseMiddleware<ApiKeyMiddleware>();
app.UseAuthorization();
app.MapControllers();
app.Run();
