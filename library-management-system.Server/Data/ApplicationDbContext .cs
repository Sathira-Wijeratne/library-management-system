using library_management_system.Server.Data.Entities;
using Microsoft.EntityFrameworkCore; // gives access to the DbContext class which represents database session, it provides ORM (Object-Relational Mapping) features for database access.

namespace library_management_system.Server.Data
{
    // defines the application's database context class.
    public class ApplicationDbContext : DbContext // ApplicationDbContext class which inherits from DbContext. 'DbContext' is a base class from Entity Framework Core. By extending it, you inherit database management features.
    {
        // this is a constructor, takes options as a parameter
        // DbContextOptions specify database configurations such as provider and connection string
        // : base(options): is syntax for calling the constructor of the base class which ApplicationDbContext is inheriting (DbContext)
        // so it calls the constructor of the DbContext base class, and pass the options object to it.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSet for book entity. it represent a collection of entities of type T that you can query from or save to the database.
        // so this lets us access and manage all Book records in database.
        public DbSet<Book> Books { get; set; }
    }
}
