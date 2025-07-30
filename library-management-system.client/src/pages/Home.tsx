import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import AddBookForm from '../components/AddBookForm';
import EditBookForm from '../components/EditBookForm';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setAddShowForm] = useState<boolean>(false);
    const [showEditForm, setEditShowForm] = useState<boolean>(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/Books');

                if (!response.ok) {
                    throw new Error(`HTTP error, status : ${response.status}`);
                }

                const data: Book[] = await response.json();
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
    // add book
    const handleAddBook = () => {
        setAddShowForm(true);
    }

    const handleAddBookCancel = () => {
        setAddShowForm(false);
    }

    const handleAddBookSuccess = (newBook: Book) => {
        setBooks(prevBooks => [newBook, ...prevBooks]);
        setAddShowForm(false);
    }

    // edit book
    const handleEditBook = (book: Book) => {
        setEditingBook(book);
        setEditShowForm(true);
    }

    const handleEditBookCancel = () => {
        setEditShowForm(false);
    }

    const handleEditBookSuccess = (updatedBook: Book) => {
        setBooks(prevBooks => prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book));
        setEditShowForm(false);
    }

    // delete book
    const handleDeleteBook = (book: Book) => {
        setBookToDelete(book);
        setShowDeleteDialog(true);
    };

    const handleDeleteBookConfirm = async () => {
        if (!bookToDelete) return;

        try {
            const response = await fetch(`/api/Books/${bookToDelete.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDelete.id));
                setShowDeleteDialog(false);
            } else {
                alert('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Error deleting book');
        }
    }

    const handleDeleteBookCancel = () => {
        setShowDeleteDialog(false);
        setBookToDelete(null);
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Error: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddBook}
                    sx={{ minWidth: isMobile ? 'auto' : 'fit-content' }}
                >
                    {'Add Book'}
                </Button>
            </Box>

            {/* Mobile view */}
            {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {books.length === 0 ? (
                        <Alert severity="info">No books found</Alert>
                    ) : (
                        books.map((book) => (
                            <Card key={book.id}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{wordBreak: 'break-all'}}>
                                        {book.title}
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom sx={{wordBreak: 'break-all'}}>
                                        {book.author}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all'}}>
                                        {book.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant='contained'
                                            startIcon={<Edit/>}
                                            color="primary"
                                            size='small'
                                            onClick={() => handleEditBook(book)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant='contained'
                                            startIcon={<Delete/>}
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteBook(book)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            ) : (
                /* Desktop Table View */
                <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{
                        maxHeight: 400, 
                        overflow: 'auto'
                    }}
                >
                    <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '80px', minWidth: '80px' }}>ID</TableCell>
                                <TableCell sx={{ width: '200px', minWidth: '200px' }}>Title</TableCell>
                                <TableCell sx={{ width: '150px', minWidth: '150px' }}>Author</TableCell>
                                <TableCell sx={{ width: 'auto', minWidth: '250px' }}>Description</TableCell>
                                <TableCell sx={{ width: '120px', minWidth: '120px' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography color="text.secondary">
                                            No books found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                books.map((book) => (
                                    <TableRow key={book.id} hover>
                                        <TableCell sx={{ 
                                            wordWrap: 'break-word',
                                            maxHeight: '100px',
                                            overflow: 'hidden'
                                        }}>
                                            {book.id}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            maxHeight: '100px',
                                            overflow: 'auto'
                                        }}>
                                            {book.title}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            maxHeight: '100px',
                                            overflow: 'auto'
                                        }}>
                                            {book.author}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            maxHeight: '100px',
                                            overflow: 'auto',
                                            lineHeight: 1.4
                                        }}>
                                            {book.description}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditBook(book)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteBook(book)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialogs */}
            {/* Add book dialog */}
            <Dialog open={showAddForm} onClose={handleAddBookCancel} maxWidth="sm" fullWidth>
                <AddBookForm onCancel={handleAddBookCancel} onSuccess={handleAddBookSuccess} />
            </Dialog>

            {/* Edit book dialog */}
            <Dialog open={showEditForm} onClose={handleEditBookCancel} maxWidth="sm" fullWidth>
                {editingBook && (
                    <EditBookForm
                        book={editingBook}
                        onCancel={handleEditBookCancel}
                        onSuccess={handleEditBookSuccess}
                    />
                )}
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={showDeleteDialog} onClose={handleDeleteBookCancel} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{bookToDelete?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteBookCancel} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBookConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}