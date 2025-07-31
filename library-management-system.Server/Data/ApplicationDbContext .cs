using library_management_system.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace library_management_system.Server.Data
{
    /// <summary>
    /// Represents the application's database context, providing access to the database using Entity Framework Core.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Constructor initializes a new instance of the <see cref="ApplicationDbContext"/> class with the specified options.
        /// </summary>
        /// <param name="options">Database provider and connection string</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        /// <summary>
        /// Gets or sets the collection of books in the database.
        /// This property represents the Books table in the database.
        /// </summary>
        public DbSet<Book> Books { get; set; }

        /// <summary>
        /// Gets or sets the collection of users in the database.
        /// This property represents the Users table in the database.
        /// </summary>
        public DbSet<User> Users { get; set; }
    }
}
