using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library_management_system.Server.Data;
using library_management_system.Server.Data.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace library_management_system.Server.Controllers
{
    /// <summary>
    /// Controller for managing books.
    /// Provides endpoints for creating, reading, updating, and deleting books.
    /// </summary>
    /// <remarks>
    /// Route : api/Books
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BooksController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="BooksController"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger.</param>
        public BooksController(ApplicationDbContext context, ILogger<BooksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // endpoints

        /// <summary>
        /// Retrieves all books.
        /// </summary>
        /// <returns>A list of books.</returns>
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Book>))]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            try
            {
                return await _context.Books
                .OrderByDescending(b=> b.Id)
                .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when fetching all books");
                return StatusCode(500, "An unexpected error occurred when fetching books information");
            }
        }

        /// <summary>
        /// Retrieves a book by its ID.
        /// </summary>
        /// <param name="id">Unique value to identify book</param>
        /// <returns>A book if found, 404 if not found, 500 if an error occurs</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Book))]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    return NotFound();
                }

                return book;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when fetching book with id: {BookId}", id);
                return StatusCode(500, "An unexpected error occured when fetching book information");
            }
        }

        /// <summary>
        /// Updates a book by its ID.
        /// </summary>
        /// <param name="id">Unique value to identify book</param>
        /// <param name="book">The book object containing updated information</param>
        /// <returns>No content if successful, 400 if ID doesn't match, 404 if book not found, 500 if an error occurs</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            Book bookEntity;

            try
            {
            // fetch book details
                bookEntity = await _context.Books.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when retrieving book with id: {BookId} for update", id);
                return StatusCode(500, "An unexpected error occurred.");
            }

            if (bookEntity == null)
            {
                return NotFound();
            }

            // update book with new values
            bookEntity.Title = book.Title;
            bookEntity.Author = book.Author;
            bookEntity.Description = book.Description;

            // mark the entity as modified
            _context.Entry(bookEntity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "There was a concurrency conflict when updating Book with id: {BookId}", id);
                return Conflict("Update could not be done due to concurrency conflict");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when updating book with id: {BookId}", id);
                return StatusCode(500, "An unexpected error occurred when updating book information");
            }

            return NoContent();
        }

        /// <summary>
        /// Creates a new book.
        /// </summary>
        /// <param name="book">The book object to be created</param>
        /// <returns> 201 if created with the new book and location header for newly created book, 500 if an error occurs</returns>
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Book))]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            try
            {
                _context.Books.Add(book);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating book");
                return StatusCode(500, "Unable to create book due to an unexpected error.");
            }

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        /// <summary>
        /// Deletes a book by its ID.
        /// </summary>
        /// <param name="id">Unique value to identify book</param>
        /// <returns>No content if successful, 404 if book not found, 500 if an error occurs</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            try
            {
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting book with id: {BookId}", id);
                return StatusCode(500, "Unable to delete book due to an unexpected error.");
            }

            return NoContent();
        }

        // helper methods

        // public bool IsBookValid(Book book)
        // {

        //     return true;
        // }
    }
}
