using library_management_system.Server.Data;
using Microsoft.EntityFrameworkCore;
using library_management_system.Server.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// registers DbContext with the dependency injection system and configures it to use SQLite database file named books.db
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite("Data Source=books.db"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
