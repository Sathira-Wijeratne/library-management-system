using System.Net;
using System.Text.Json;

namespace library_management_system.Middleware.Exceptions
{
    /// <summary>
    /// Global exception handling middleware to handle unexpected exceptions
    /// </summary>
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

        /// <summary>
        /// Constructor for dependency injection
        /// </summary>
        /// <param name="next">Next middleware in the pipeline</param>
        /// <param name="logger">Logger instance for logging errors</param>
        public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Main method to invoke the middleware
        /// </summary>
        /// <param name="context">HTTP context for current request</param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occured : {Message} at {Path}", ex.Message, context.Request.Path);
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Handles the exception by setting the response status code and writing a JSON response
        /// </summary>
        /// <param name="context">HTTP context for current request</param>
        /// <param name="exception">Exception that was thrown</param>
        /// <returns></returns>
        public static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // set the response content type and status code
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // create a response object with error details
            var response = new
            {
                error = new
                {
                    message = "An unexpected error occured. Please try again later.",
                    details = exception.ToString(),
                    timeStamp = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                    path = context.Request.Path.ToString()
                }
            };

            // convert the response object to JSON format
            var jsonResponse = JsonSerializer.Serialize(response);
            // write JSON response to the HTTP response
            await context.Response.WriteAsync(jsonResponse);
        } 
    }
}