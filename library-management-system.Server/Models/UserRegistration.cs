using System.ComponentModel.DataAnnotations;

namespace library_management_system.Server.Models
{
    /// <summary>
    /// Model for user registration with password confirmation
    /// </summary>
    public class UserRegistration
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        [Required(ErrorMessage = "Username is required")]
        [StringLength(24, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 24 characters")]
        [RegularExpression(@"^[a-zA-Z0-9][a-zA-Z0-9-_.]{1,22}[a-zA-Z0-9]$", ErrorMessage = "Username must start and end with a letter or number, and can only contain letters, numbers, hyphens, underscores, or periods.")]
        public required string Username { get; set; }

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [StringLength(32, MinimumLength = 8, ErrorMessage = "Password must be at between 8 and 32 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;""'<>,.?/~`-])[a-zA-Z0-9!@#$%^&*()_+={}\[\]|:;""'<>,.?/~`-]{8,32}$", ErrorMessage = "Password must have atleast 1 UPPERCASE, 1 lowercase, 1 digit, and 1 special character with length between 8-32")]
        public required string Password { get; set; }

        /// <summary>
        /// Gets or sets the confirm password field for validation.
        /// </summary>
        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("Password", ErrorMessage = "Password and confirmation password do not match")]
        public required string ConfirmPassword { get; set; }
    }
}
