using System.ComponentModel.DataAnnotations;

namespace library_management_system.Server.Models
{
    /// <summary>
    /// Model for user login
    /// </summary>
    public class UserLogin
    {
        /// <summary>
        /// User's username
        /// </summary>
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(24, MinimumLength = 3, ErrorMessage = "The username must be between 3 and 24 characters.")]
        [RegularExpression(@"^[a-zA-Z0-9][a-zA-Z0-9-_.]{1,22}[a-zA-Z0-9]$", ErrorMessage = "Username must start and end with a letter or number, and can only contain letters, numbers, hyphens, underscores, or periods.")]
        public required string Username { get; set; }

        /// <summary>
        /// User's password
        /// </summary>
        [Required(ErrorMessage = "Password is required.")]
        [StringLength(32, MinimumLength = 8, ErrorMessage = "The password must be between 8 and 32 characters.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;""'<>,.?/~`-])[a-zA-Z0-9!@#$%^&*()_+={}\[\]|:;""'<>,.?/~`-]{8,32}$", ErrorMessage = "Password must include at least one of each : lowercase letter, uppercase letter, digit (0-9), special character(!@#$%^&*()_+={}[]|:;\"'<>,.?/~`-\")")]
        public required string Password { get; set; }
    }
}
