using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using OutOfOffice.Server.Models.SQLmodels;
using OutOfOffice.Server.Services.Implementations;
using OutOfOffice.Server.Services.Interfaces;
using Nager.Holiday;
using OutOfOffice.Server.Security;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("BossPosition", policy =>
        policy.Requirements.Add(new PositionRequirement(new[] { "BOSS" })));
    options.AddPolicy("HRPosition", policy =>
        policy.Requirements.Add(new PositionRequirement(new[] { "HR", "BOSS" })));
    options.AddPolicy("PMPosition", policy =>
        policy.Requirements.Add(new PositionRequirement(new[] { "Project Manager", "BOSS" })));
    options.AddPolicy("HighPosition", policy =>
        policy.Requirements.Add(new PositionRequirement(new[] { "HR", "Project Manager", "BOSS" })));
});

builder.Services.AddTransient<IUserService, UserService>();

builder.Services.AddScoped<AuthService>();

builder.Services.AddScoped<IAuthorizationHandler, PositionHandler>();

builder.Services.AddControllersWithViews();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("https://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IWorkdayCalculatorService, WorkdayCalculatorService>();
builder.Services.AddScoped<HolidayClient>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();

app.UseAuthorization();

app.Use(async (context, next) =>
{
    if (!context.User.Identity.IsAuthenticated &&
        context.Request.Path != "/Login" &&
        !context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.Redirect("/Login");
        return;
    }

    await next();
});


app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();