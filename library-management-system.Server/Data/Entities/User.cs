using System.ComponentModel.DataAnnotations;

namespace library_management_system.Server.Data.Entities
{
    /// <summary>
    /// Represents a user in the library management system.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Gets or sets the username. This serves as the primary key.
        /// </summary>
        [Key]
        [StringLength(50, MinimumLength = 3)]
        public required string Username { get; set; } 

        /// <summary>
        /// Gets or sets the hashed password.
        /// </summary>
        public required string PasswordHash { get; set; }
    }
}
