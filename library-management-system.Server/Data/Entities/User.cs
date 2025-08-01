using System.ComponentModel.DataAnnotations;

namespace library_management_system.Server.Data.Entities
{
    /// <summary>
    /// Represents a user entity in the library management system.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Gets or sets the username. This serves as the primary key.
        /// </summary>
        [Key]
        [Required]
        [StringLength(24, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 24 characters")]
        [RegularExpression(@"^[a-zA-Z0-9][a-zA-Z0-9-_.]{1,22}[a-zA-Z0-9]$", ErrorMessage = "Username must start and end with a letter or number, and can only contain letters, numbers, hyphens, underscores, or periods.")]
        public required string Username { get; set; }

        /// <summary>
        /// Gets or sets the hashed password.
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 50)]
        public required string PasswordHash { get; set; }
    }
}
