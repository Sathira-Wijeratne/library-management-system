using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using library_management_system.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace library_management_system.Server.Controllers
{
    /// <summary>
    /// Controller for handling authentication operations.
    /// Provides endpoints for user login and JWT token generation.
    /// </summary>
    /// <remarks>
    /// Route: api/Auth
    /// </remarks>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration; //needed to read settings from appsettings.json files
        private readonly ILogger<AuthController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="logger">The logger.</param>
        public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token upon successful login.
        /// </summary>
        /// <param name="user">The user login credentials.</param>
        /// <returns>A JWT token if authentication is successful, otherwise Unauthorized.</returns>
        /// <response code="200">Returns the JWT token</response>
        /// <response code="401">If the credentials are invalid</response>
        /// <response code="400">If the request is malformed</response>
        [HttpPost("login")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(400)]
        public IActionResult Login([FromBody] UserLogin user)
        {
            try
            {
                if (user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
                {
                    _logger.LogWarning("Login attempt with invalid request data");
                    return BadRequest("Username and password are required.");
                }

                // TODO : Check against database credentials
                if (user.Username == "admin" && user.Password == "password")
                {
                    var token = GenerateJwtToken(user.Username);
                    _logger.LogInformation("User {Username} logged in successfully", user.Username);
                    return Ok(new { token, message = "Login successful" });
                }

                _logger.LogWarning("Failed login attempt for username: {Username}", user.Username);
                return Unauthorized("Invalid credentials.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login process");
                return StatusCode(500, "An error occurred during login.");
            }
        }

        /// <summary>
        /// Returns information about the currently authenticated user.
        /// This endpoint is protected and requires a valid JWT token.
        /// </summary>
        /// <returns>User information from the JWT token.</returns>
        /// <response code="200">Returns the user information</response>
        /// <response code="401">If the user is not authenticated</response>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var username = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                var jti = User.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

                return Ok(new
                {
                    username = username,
                    tokenId = jti,
                    message = "Token is valid"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting current user info");
                return StatusCode(500, "An error occurred while retrieving user information.");
            }
        }

        // helper methods

        /// <summary>
        /// Generates a JWT token for the authenticated user.
        /// </summary>
        /// <param name="username">The username of the authenticated user.</param>
        /// <returns>A JWT token string.</returns>
        private string GenerateJwtToken(string username)
        {
            var claims = new[] // describe user and are embedded in the JWT token.
            {
                new Claim(JwtRegisteredClaimNames.Sub, username), // Sub - Subject
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Jti - JWT ID (unique token identifier), GUID (Globally Unique Identifier) ensures each JWT token has a unique ID
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64), // Iat - Issued At (when token was created)
                new Claim(ClaimTypes.Name, username) // Name claim (username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!)); // convert secret string to cryptographic secret key
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); // signs token using HMAC-SHA256 algorithm

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
