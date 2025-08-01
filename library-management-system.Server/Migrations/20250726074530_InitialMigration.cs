using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace library_management_system.Server.Migrations
{
    /// <inheritdoc />
    /// 
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        /// if this migration is applied, it will attempt to create a new table named Books and will generate columns corresponding to Book entity class. 
        /// up method - defines what happens when the migration is applied
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", nullable: false),
                    author = table.Column<string>(type: "TEXT", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });
        }

        /// <inheritdoc />
        /// down metho - defines how to undo the migration
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");
        }
    }
}
