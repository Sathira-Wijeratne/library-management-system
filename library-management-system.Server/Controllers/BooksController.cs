using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library_management_system.Server.Data;
using library_management_system.Server.Data.Entities;
using Microsoft.Extensions.Logging;

namespace library_management_system.Server.Controllers
{
    // route definition - api/Books
    [Route("api/[controller]")] 
    [ApiController] // instructs the application that this class is supposed to handle HTTP requests
    public class BooksController : ControllerBase // inherit from ControllerBase. gives access to specific methods and functionality needed for API.
    {
        private readonly ApplicationDbContext _context; // readonly field can only be assigned a value once, either when declared or in the constructor
        private readonly ILogger<BooksController> _logger;

        // inject DbContext
        public BooksController(ApplicationDbContext context, ILogger<BooksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // endpoints
        // GET: api/Books
        [HttpGet]
        // IEnumerable<T> is an interface representing a collection of T objects that can be iterated over (like a list or array). It's used for  used for returning collections
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            // ToListAsync() is an Entity Framework Core method that asynchronously executes the database query and returns the results as a List
            return await _context.Books.ToListAsync();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound(); // return 404
            }

            return book;
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        //IActionResult allows to return different types of HTTP responses, used when only HTTP status codes are returned
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest(); // return 400
            }

            var bookEntity = await _context.Books.FindAsync(id);

            if (bookEntity == null)
            {
                return NotFound();
            }

            bookEntity.Title = book.Title;
            bookEntity.Author = book.Author;
            bookEntity.Description = book.Description;

            _context.Entry(bookEntity).State = EntityState.Modified; // what is State and EntityState.Modified

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex) // Exception when another user has updated or deleted the same entity in the database since it was loaded
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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        // Task<T>: Represents an asynchronous operation that will return a value of type T. 
        // In this context, it means the method is asynchronous and can be awaited.
        // ActionResult is the result of an action method, it provides a flexible way to return either the actual data on success, or an HTTP status code with an optional message
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            _context.Books.Add(book); // stages the book object to be inserted
            await _context.SaveChangesAsync(); // SaveChangesAsync() commits changes to the database

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
            // CreatedAtAction is a helper method that returns a 201 Created HTTP response
            // It also includes a Location header pointing to the URL of the newly created resource
            // "GetBook" is to the name of the action method in the controller that retrieves a book by its ID
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
