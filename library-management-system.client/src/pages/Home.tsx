import {useState, useEffect} from 'react';
import type { Book } from '../types/Book';
import AddBookForm from '../components/AddBookForm';

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [addingBook, setAddingBook] = useState<Book | null>(null);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(()=>{
        // if this is moved outside it would be recreated on every component render causing infinite re-render. How?
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/Books');

                if (!response.ok) {
                    // Error is JavaScript's built-in error constructor. it's caught by the catch block below.
                    throw new Error(`HTTP error, status : ${response.status}`);
                }

                //  response.json() parses the JSON response into a JavaScript object/array. It is just type-casting it as Book[]
                const data : Book[] = await response.json();
                setBooks(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occured, unable to fetch books');
                console.error('Error when fetching books : ', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // functions
    const handleAddBook = () => {
        setShowForm(true);
        
    }

    const handleAddBookCancel = () => {
        setShowForm(false);
    }

    const handleAddBookSuccess = (newBook: Book) => {
        setBooks(prevBooks => [...prevBooks, newBook]);
        setShowForm(false);
    }

    const handleEditBook =(book : Book) => {
        setEditingBook(book);
        setShowForm(true);
    }

    const handleEditBookCancel = () => {
        setShowForm(false);
    }

    const handleDeleteBook = async (bookId: number) => {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            const response = await fetch(`/api/Books/${bookId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            } else {
                alert('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Error deleting book');
        }
    }

    if (loading) {
        return <div>Loading books...</div>;
    }

    if (error) {
        return <div>Error : {error}</div>
    }

    return (
        <div>
            <h1>Library Management System</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Books</h2>
                <button onClick={()=> handleAddBook()}>Add book</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length === 0 ? (
                        <tr>
                            <td colSpan={5}>No Books found</td>
                        </tr>
                    ) : (
                        books.map((book) => (
                        // key helps React identify which items changed/moved/added/removed for efficient re-rendering. Mapping works without it, but React will show warnings and performance may suffer.
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.description}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={()=>handleEditBook(book)}>Edit</button>
                                    <button onClick={()=>handleDeleteBook(book.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>

                        ))
                    )}
                </tbody>
            </table>

            {showForm && <AddBookForm onCancel={handleAddBookCancel} onSuccess={handleAddBookSuccess} />}
        </div>
    );
}