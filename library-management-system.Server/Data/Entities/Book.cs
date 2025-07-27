using System.ComponentModel.DataAnnotations;

namespace library_management_system.Server.Data.Entities
{
    public class Book
    {
        // Entity Framework will consider Id as primary key automatically
        public int Id { get; set; }
        [Required]
        public required string Title { get; set; }
        [Required]
        public required string Author { get; set; }
        [Required]
        public required string Description { get; set; }
    }
}
