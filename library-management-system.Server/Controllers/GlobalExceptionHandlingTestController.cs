using Microsoft.AspNetCore.Mvc;

namespace library_management_system.Controllers
{
    /// <summary>
    /// Controller for testing global exception handling
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class GlobalExceptionHandlingTestController : ControllerBase
    {

        /// <summary>
        /// Test endpoint to verify if the API is working
        /// </summary>
        /// <returns></returns>
        [HttpGet("test")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public IActionResult Test()
        {
            return Ok("Test endpoint is working!");
        }

        /// <summary>
        /// Endpoint to throw an exception for testing global exception handling
        /// </summary>
        /// <exception cref="Exception">Test exception to verify global exception handling</exception>
        [HttpGet("exception")]
        [ProducesResponseType(500)]
        public IActionResult ThrowException()
        {
            throw new Exception("This is a test exception to verify global exception handling");
        }

        /// <summary>
        /// Endpoint to throw a null reference exception for testing global exception handling
        /// </summary>
        [HttpGet("null-reference")]
        [ProducesResponseType(500)]
        public IActionResult ThrowNullReference()
        {
            string? nullString = null;
            return Ok(nullString.Length);
        }
    }
}